import logging
from datetime import datetime

import requests
from flask import Blueprint, request

from src.api_helpers import success_response
from src.queries.get_celery_tasks import convert_epoch_to_datetime, get_celery_tasks
from src.queries.get_db_seed_restore_status import get_db_seed_restore_status
from src.queries.get_entities_count_check import get_entities_count_check
from src.queries.get_health import get_health, get_location
from src.queries.get_latest_play import get_latest_play
from src.queries.get_sol_plays import get_latest_sol_play_check_info
from src.queries.get_trusted_notifier_discrepancies import (
    get_trusted_notifier_discrepancies,
)
from src.queries.queries import parse_bool_param
from src.tasks.index_profile_challenge_backfill import (
    index_profile_challenge_backfill_tablename,
)
from src.utils import helpers, redis_connection
from src.utils.db_session import get_db_read_replica
from src.utils.elasticdsl import esclient
from src.utils.update_indexing_checkpoints import get_last_indexed_checkpoint

logger = logging.getLogger(__name__)

bp = Blueprint("health_check", __name__)

disc_prov_version = helpers.get_discovery_provider_version()


@bp.route("/version", methods=["GET"])
def version():
    return success_response(disc_prov_version, sign_response=False)


@bp.route("/health_check", methods=["GET"])
def health_check():
    args = {
        "verbose": parse_bool_param(request.args.get("verbose")),
        "healthy_block_diff": request.args.get("healthy_block_diff", type=int),
        "enforce_block_diff": parse_bool_param(request.args.get("enforce_block_diff")),
        "challenge_events_age_max_drift": request.args.get(
            "challenge_events_age_max_drift", type=int
        ),
        "plays_count_max_drift": request.args.get("plays_count_max_drift", type=int),
        "reactions_max_indexing_drift": request.args.get(
            "reactions_max_indexing_drift", type=int
        ),
        "reactions_max_last_reaction_drift": request.args.get(
            "reactions_max_last_reaction_drift", type=int
        ),
        "rewards_manager_max_drift": request.args.get(
            "rewards_manager_max_drift", type=int
        ),
        "user_bank_max_drift": request.args.get("user_bank_max_drift", type=int),
        "spl_audio_max_drift": request.args.get("spl_audio_max_drift", type=int),
    }
    try:
        comms_health = {"comms": requests.get("http://comms:8925/comms").json()}
    except Exception as e:
        logger.error(f"Error fetching comms health {e}")
        comms_health = {}

    (health_results, error) = get_health(args)
    return success_response(
        health_results, 500 if error else 200, sign_response=False, extras=comms_health
    )


@bp.route("/trusted_notifier_discrepancies_check", methods=["GET"])
def trusted_notifier_discrepancies_check():
    (health_results, error) = get_trusted_notifier_discrepancies()
    return success_response(health_results, 500 if error else 200, sign_response=False)


@bp.route("/entities_count_check", methods=["GET"])
def entities_count_check():
    res_count = get_entities_count_check()
    return success_response(res_count)


# Health check for block diff between DB and chain.
@bp.route("/block_check", methods=["GET"])
def block_check():
    args = {
        "verbose": parse_bool_param(request.args.get("verbose")),
        "healthy_block_diff": request.args.get("healthy_block_diff", type=int),
        "enforce_block_diff": True,
    }

    (health_results, error) = get_health(args, use_redis_cache=False)
    return success_response(health_results, 500 if error else 200, sign_response=False)


# Health check for latest play stored in the db
@bp.route("/play_check", methods=["GET"])
def play_check():
    """
    max_drift: maximum duration in seconds between `now` and the
     latest recorded play record to be considered healthy
    """
    max_drift = request.args.get("max_drift", type=int)

    latest_play = get_latest_play()
    drift = (datetime.now() - latest_play).total_seconds()

    # Error if max drift was provided and the drift is greater than max_drift
    error = max_drift and drift > max_drift

    return success_response(latest_play, 500 if error else 200, sign_response=False)


# Health check for latest play stored in the db
@bp.route("/sol_play_check", methods=["GET"])
def sol_play_check():
    """
    limit: number of latest plays to return
    max_drift: maximum duration in seconds between `now` and the
    latest recorded play record to be considered healthy
    """
    limit = request.args.get("limit", type=int, default=20)
    max_drift = request.args.get("max_drift", type=int)
    error = None
    redis = redis_connection.get_redis()

    response = {}
    response = get_latest_sol_play_check_info(redis, limit)
    latest_db_sol_plays = response["latest_db_sol_plays"]

    if latest_db_sol_plays:
        latest_db_play = latest_db_sol_plays[0]
        latest_created_at = latest_db_play["created_at"]
        drift = (datetime.now() - latest_created_at).total_seconds()

        # Error if max drift was provided and the drift is greater than max_drift
        error = max_drift and drift > max_drift

    return success_response(response, 500 if error else 200, sign_response=False)


@bp.route("/ip_check", methods=["GET"])
def ip_check():
    ip = helpers.get_ip(request)
    return success_response(ip, sign_response=False)


@bp.route("/es_health", methods=["GET"])
def es_health():
    ok = esclient.cat.indices(v=True)
    return str(ok)


@bp.route("/celery_tasks_check", methods=["GET"])
def celery_tasks_check():
    tasks = get_celery_tasks()
    all_tasks = tasks.get("celery_tasks", [])

    for task in all_tasks.get("active_tasks", []):
        task["started_at_est_timestamp"] = convert_epoch_to_datetime(
            task.get("started_at")
        )
    return success_response(tasks, sign_response=False)


@bp.route("/db_seed_restore_check", methods=["GET"])
def db_seed_restore_check():
    has_restored, seed_hash = get_db_seed_restore_status()
    response = {"has_restored": has_restored, "seed_hash": seed_hash}
    return success_response(response, sign_response=False)


@bp.route("/location", methods=["GET"])
def location():
    location = get_location()
    return success_response(location, sign_response=False)


@bp.route("/backfill_profile_challenge", methods=["GET"])
def backfill_profile_challenge_check():
    db = get_db_read_replica()
    with db.scoped_session() as session:
        checkpoint = get_last_indexed_checkpoint(
            session, index_profile_challenge_backfill_tablename
        )
        return success_response(checkpoint, sign_response=False)
