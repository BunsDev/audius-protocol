import { UndisbursedUserChallenge } from 'store/pages'

import {
  ChallengeRewardID,
  UserChallenge,
  OptimisticUserChallenge,
  ChallengeName,
  SpecifierWithAmount
} from '../models'

import dayjs from './dayjs'
import { formatNumberCommas } from './formatUtil'

export type ChallengeRewardsInfo = {
  id: ChallengeRewardID
  title: string
  description: (amount: OptimisticUserChallenge | undefined) => string
  fullDescription?: (amount: OptimisticUserChallenge | undefined) => string
  progressLabel?: string
  remainingLabel?: string
  panelButtonText: string
  isVerifiedChallenge?: boolean
}

export const challengeRewardsConfig: Record<
  ChallengeRewardID,
  ChallengeRewardsInfo
> = {
  referrals: {
    id: 'referrals',
    title: 'Invite Your Friends!',
    description: (challenge) =>
      `Earn ${challenge?.amount} $AUDIO for you and your friend.`,
    fullDescription: (challenge) =>
      `Invite your Friends! You’ll earn ${challenge?.amount} $AUDIO for each friend who joins with your link (and they’ll get an $AUDIO too)`,
    progressLabel: '%0/%1 Invites Accepted',
    remainingLabel: '%0/%1 Invites Remain',
    panelButtonText: 'Invite Your Friends'
  },
  'ref-v': {
    id: 'ref-v',
    title: 'Invite your Fans',
    description: (challenge) =>
      `Earn up to ${formatNumberCommas(challenge?.totalAmount ?? '')} $AUDIO`,
    fullDescription: (challenge) =>
      `Invite your fans! You’ll earn ${challenge?.amount} $AUDIO for each fan who joins with your link (and they’ll get an $AUDIO too)`,
    progressLabel: '%0/%1 Invites Accepted',
    remainingLabel: '%0/%1 Invites Remain',
    panelButtonText: 'Invite your Fans',
    isVerifiedChallenge: true
  },
  referred: {
    id: 'referred',
    title: 'You Accepted An Invite',
    description: () => `You earned $AUDIO for being invited`,
    fullDescription: () => `You earned $AUDIO for being invited`,
    progressLabel: '%0/%1 Invites',
    panelButtonText: 'More Info'
  },
  'connect-verified': {
    id: 'connect-verified',
    title: 'Link Verified Accounts',
    description: (challenge) =>
      `Link your verified social media accounts to earn ${challenge?.amount} $AUDIO.`,
    fullDescription: () =>
      'Get verified on Audius by linking your verified Twitter or Instagram account!',
    progressLabel: 'Not Linked',
    panelButtonText: 'Link Verified Account'
  },
  'listen-streak': {
    id: 'listen-streak',
    title: 'Listening Streak: 7 Days',
    description: (challenge) =>
      `Listen to one track a day for seven days to earn ${challenge?.amount} $AUDIO.`,
    fullDescription: () =>
      'Sign in and listen to at least one track every day for 7 days',
    progressLabel: '%0/%1 Days',
    panelButtonText: 'Trending on Audius'
  },
  'mobile-install': {
    id: 'mobile-install',
    title: 'Get the Audius Mobile App',
    description: (challenge) => `Earn ${challenge?.amount} $AUDIO.`,
    fullDescription: () =>
      'Install the Audius app for iPhone and Android and Sign in to your account!',
    progressLabel: 'Not Installed',
    panelButtonText: 'Get the App'
  },
  'profile-completion': {
    id: 'profile-completion',
    title: 'Complete Your Profile',
    description: (challenge) =>
      `Complete your Audius profile to earn ${challenge?.amount} $AUDIO.`,
    fullDescription: () =>
      'Fill out the missing details on your Audius profile and start interacting with tracks and artists!',
    progressLabel: '%0/%1 Complete',
    panelButtonText: 'More Info'
  },
  'track-upload': {
    id: 'track-upload',
    title: 'Upload 3 Tracks',
    description: (challenge) =>
      `Earn ${challenge?.amount} $AUDIO for uploading 3 tracks.`,
    fullDescription: () => 'Upload 3 tracks to your profile',
    progressLabel: '%0/%1 Uploaded',
    panelButtonText: 'Upload Tracks'
  },
  'send-first-tip': {
    id: 'send-first-tip',
    title: 'Send Your First Tip',
    description: (_) =>
      'Show some love to your favorite artist and send them a tip.',
    fullDescription: () =>
      'Show some love to your favorite artist and send them a tip.',
    progressLabel: 'Not Earned',
    panelButtonText: 'Send a Tip'
  },
  'first-playlist': {
    id: 'first-playlist',
    title: 'Create a Playlist',
    description: (_) => 'Create a playlist and add a track to it.',
    fullDescription: () => 'Create a playlist and add a track to it.',
    progressLabel: 'Not Earned',
    panelButtonText: 'Discover Some Tracks'
  },
  [ChallengeName.AudioMatchingSell]: {
    id: ChallengeName.AudioMatchingSell,
    title: 'Sell to Earn',
    description: (_) =>
      'Receive 1 additional $AUDIO for each dollar earned from sales.',
    fullDescription: () =>
      'Receive 1 additional $AUDIO for each dollar earned from sales.',
    progressLabel: 'No Recent Activity',
    panelButtonText: 'View Details'
  },
  [ChallengeName.AudioMatchingBuy]: {
    id: ChallengeName.AudioMatchingBuy,
    title: 'Spend to Earn',
    description: (_) =>
      'Earn 1 $AUDIO for each dollar you spend on premium tracks.',
    fullDescription: () =>
      'Earn 1 $AUDIO for each dollar you spend on premium tracks.',
    progressLabel: 'No Recent Activity',
    panelButtonText: 'View Details'
  },
  'trending-playlist': {
    id: 'trending-playlist',
    title: 'Top 5 Trending Playlists',
    description: () => 'Winners are selected every Friday at Noon PT!',
    panelButtonText: 'See More'
  },
  'trending-track': {
    title: 'Top 5 Trending Tracks',
    description: () => 'Winners are selected every Friday at Noon PT!',
    panelButtonText: 'See More',
    id: 'trending-track'
  },
  'top-api': {
    title: 'Top 10 API Apps',
    description: () => 'The top 10 Audius API apps each month win.',
    panelButtonText: 'More Info',
    id: 'top-api'
  },
  'verified-upload': {
    title: 'First Upload With Your Verified Account',
    description: () =>
      'Verified on Twitter/Instagram? Upload your first track, post it on social media, & tag us.',
    panelButtonText: 'More Info',
    id: 'verified-upload'
  },
  'trending-underground': {
    title: 'Top 5 Underground Trending',
    description: () => 'Winners are selected every Friday at Noon PT!',
    panelButtonText: 'See More',
    id: 'trending-underground'
  }
}

export const makeChallengeSortComparator = (
  userChallenges: Record<string, UserChallenge>
): ((id1: ChallengeRewardID, id2: ChallengeRewardID) => number) => {
  return (id1, id2) => {
    const userChallenge1 = userChallenges[id1]
    const userChallenge2 = userChallenges[id2]

    if (!userChallenge1 || !userChallenge2) {
      return 0
    }
    if (userChallenge1.is_disbursed) {
      return 1
    }
    if (userChallenge1.is_complete) {
      return -1
    }
    if (userChallenge2.is_disbursed) {
      return -1
    }
    if (userChallenge2.is_complete) {
      return 1
    }
    return 0
  }
}

export const makeOptimisticChallengeSortComparator = (
  userChallenges: Partial<Record<ChallengeRewardID, OptimisticUserChallenge>>
): ((id1: ChallengeRewardID, id2: ChallengeRewardID) => number) => {
  return (id1, id2) => {
    const userChallenge1 = userChallenges[id1]
    const userChallenge2 = userChallenges[id2]

    if (isAudioMatchingChallenge(id1)) {
      return -1
    }
    if (!userChallenge1 || !userChallenge2) {
      return 0
    }
    if (userChallenge1?.claimableAmount > 0) {
      return -1
    }
    if (userChallenge1?.state === 'disbursed') {
      return 1
    }
    if (userChallenge1?.state === 'completed') {
      return -1
    }
    if (userChallenge2?.state === 'disbursed') {
      return -1
    }
    if (userChallenge2?.claimableAmount > 0) {
      return 1
    }
    if (userChallenge2?.state === 'completed') {
      return 1
    }
    return 0
  }
}

export const isAudioMatchingChallenge = (
  challenge: ChallengeRewardID
): challenge is
  | ChallengeName.AudioMatchingSell
  | ChallengeName.AudioMatchingBuy => {
  return (
    challenge === ChallengeName.AudioMatchingSell ||
    challenge === ChallengeName.AudioMatchingBuy
  )
}

// TODO: currently only $AUDIO matching challenges have cooldown
// so this works, but really we should check if `cooldown_period` exists on the
// challenge instead of using `!isAudioMatchingChallenge`. PAY-2030
export const isCooldownChallengeClaimable = (
  challenge: UndisbursedUserChallenge
) => {
  return (
    !isAudioMatchingChallenge(challenge.challenge_id) ||
    dayjs.utc().diff(dayjs.utc(challenge.created_at), 'day') >= 7
  )
}
/* Filter for only claimable challenges */
export const getClaimableChallengeSpecifiers = (
  specifiers: SpecifierWithAmount[],
  undisbursedUserChallenges: UndisbursedUserChallenge[]
) => {
  return specifiers.filter((s) => {
    const challenge = undisbursedUserChallenges.filter(
      (c) => c.specifier === s.specifier
    )[0] // specifiers are unique
    return isCooldownChallengeClaimable(challenge)
  })
}
