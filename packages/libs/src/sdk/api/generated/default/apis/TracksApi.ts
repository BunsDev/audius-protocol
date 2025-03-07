/* tslint:disable */
// @ts-nocheck
/* eslint-disable */
/**
 * API
 * Audius V1 API
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  TrackResponse,
  TrackSearch,
  TracksResponse,
} from '../models';
import {
    TrackResponseFromJSON,
    TrackResponseToJSON,
    TrackSearchFromJSON,
    TrackSearchToJSON,
    TracksResponseFromJSON,
    TracksResponseToJSON,
} from '../models';

export interface GetBulkTracksRequest {
    permalink?: Array<string>;
    id?: Array<string>;
}

export interface GetTrackRequest {
    trackId: string;
}

export interface GetTrendingTracksRequest {
    genre?: string;
    time?: GetTrendingTracksTimeEnum;
}

export interface GetUndergroundTrendingTracksRequest {
    offset?: number;
    limit?: number;
}

export interface SearchTracksRequest {
    query: string;
    onlyDownloadable?: string;
}

export interface StreamTrackRequest {
    trackId: string;
    preview?: boolean;
    userSignature?: string;
    userData?: string;
    premiumContentSignature?: string;
    filename?: string;
    skipPlayCount?: boolean;
}

/**
 * 
 */
export class TracksApi extends runtime.BaseAPI {

    /**
     * @hidden
     * Gets a list of tracks using their IDs or permalinks
     */
    async getBulkTracksRaw(params: GetBulkTracksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TracksResponse>> {
        const queryParameters: any = {};

        if (params.permalink) {
            queryParameters['permalink'] = params.permalink;
        }

        if (params.id) {
            queryParameters['id'] = params.id;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/tracks`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TracksResponseFromJSON(jsonValue));
    }

    /**
     * Gets a list of tracks using their IDs or permalinks
     */
    async getBulkTracks(params: GetBulkTracksRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TracksResponse> {
        const response = await this.getBulkTracksRaw(params, initOverrides);
        return await response.value();
    }

    /**
     * @hidden
     * Gets a track by ID
     */
    async getTrackRaw(params: GetTrackRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TrackResponse>> {
        if (params.trackId === null || params.trackId === undefined) {
            throw new runtime.RequiredError('trackId','Required parameter params.trackId was null or undefined when calling getTrack.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/tracks/{track_id}`.replace(`{${"track_id"}}`, encodeURIComponent(String(params.trackId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TrackResponseFromJSON(jsonValue));
    }

    /**
     * Gets a track by ID
     */
    async getTrack(params: GetTrackRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TrackResponse> {
        const response = await this.getTrackRaw(params, initOverrides);
        return await response.value();
    }

    /**
     * @hidden
     * Gets the top 100 trending (most popular) tracks on Audius
     */
    async getTrendingTracksRaw(params: GetTrendingTracksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TracksResponse>> {
        const queryParameters: any = {};

        if (params.genre !== undefined) {
            queryParameters['genre'] = params.genre;
        }

        if (params.time !== undefined) {
            queryParameters['time'] = params.time;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/tracks/trending`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TracksResponseFromJSON(jsonValue));
    }

    /**
     * Gets the top 100 trending (most popular) tracks on Audius
     */
    async getTrendingTracks(params: GetTrendingTracksRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TracksResponse> {
        const response = await this.getTrendingTracksRaw(params, initOverrides);
        return await response.value();
    }

    /**
     * @hidden
     * Gets the top 100 trending underground tracks on Audius
     */
    async getUndergroundTrendingTracksRaw(params: GetUndergroundTrendingTracksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TracksResponse>> {
        const queryParameters: any = {};

        if (params.offset !== undefined) {
            queryParameters['offset'] = params.offset;
        }

        if (params.limit !== undefined) {
            queryParameters['limit'] = params.limit;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/tracks/trending/underground`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TracksResponseFromJSON(jsonValue));
    }

    /**
     * Gets the top 100 trending underground tracks on Audius
     */
    async getUndergroundTrendingTracks(params: GetUndergroundTrendingTracksRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TracksResponse> {
        const response = await this.getUndergroundTrendingTracksRaw(params, initOverrides);
        return await response.value();
    }

    /**
     * @hidden
     * Search for a track or tracks
     */
    async searchTracksRaw(params: SearchTracksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TrackSearch>> {
        if (params.query === null || params.query === undefined) {
            throw new runtime.RequiredError('query','Required parameter params.query was null or undefined when calling searchTracks.');
        }

        const queryParameters: any = {};

        if (params.query !== undefined) {
            queryParameters['query'] = params.query;
        }

        if (params.onlyDownloadable !== undefined) {
            queryParameters['only_downloadable'] = params.onlyDownloadable;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/tracks/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TrackSearchFromJSON(jsonValue));
    }

    /**
     * Search for a track or tracks
     */
    async searchTracks(params: SearchTracksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TrackSearch> {
        const response = await this.searchTracksRaw(params, initOverrides);
        return await response.value();
    }

    /**
     * @hidden
     * This endpoint accepts the Range header for streaming. https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
     * Get the streamable MP3 file of a track
     */
    async streamTrackRaw(params: StreamTrackRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (params.trackId === null || params.trackId === undefined) {
            throw new runtime.RequiredError('trackId','Required parameter params.trackId was null or undefined when calling streamTrack.');
        }

        const queryParameters: any = {};

        if (params.preview !== undefined) {
            queryParameters['preview'] = params.preview;
        }

        if (params.userSignature !== undefined) {
            queryParameters['user_signature'] = params.userSignature;
        }

        if (params.userData !== undefined) {
            queryParameters['user_data'] = params.userData;
        }

        if (params.premiumContentSignature !== undefined) {
            queryParameters['premium_content_signature'] = params.premiumContentSignature;
        }

        if (params.filename !== undefined) {
            queryParameters['filename'] = params.filename;
        }

        if (params.skipPlayCount !== undefined) {
            queryParameters['skip_play_count'] = params.skipPlayCount;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/tracks/{track_id}/stream`.replace(`{${"track_id"}}`, encodeURIComponent(String(params.trackId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * This endpoint accepts the Range header for streaming. https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
     * Get the streamable MP3 file of a track
     */
    async streamTrack(params: StreamTrackRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.streamTrackRaw(params, initOverrides);
    }

}

/**
 * @export
 */
export const GetTrendingTracksTimeEnum = {
    Week: 'week',
    Month: 'month',
    Year: 'year',
    AllTime: 'allTime'
} as const;
export type GetTrendingTracksTimeEnum = typeof GetTrendingTracksTimeEnum[keyof typeof GetTrendingTracksTimeEnum];
