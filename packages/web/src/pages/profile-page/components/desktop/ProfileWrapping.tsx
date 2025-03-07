import { ID, ProfilePictureSizes, Nullable } from '@audius/common'
import cn from 'classnames'

import BadgeArtist from 'assets/img/badgeArtist.svg'
import ProfilePicture from 'components/profile-picture/ProfilePicture'
import FollowsYouBadge from 'components/user-badges/FollowsYouBadge'
import EditableName from 'pages/profile-page/components/EditableName'

import { ProfileLeftNav } from './ProfileLeftNav'
import styles from './ProfilePage.module.css'

type ProfileWrappingProps = {
  userId: Nullable<ID>
  isDeactivated: boolean
  allowAiAttribution: boolean
  loading: boolean
  verified: boolean
  profilePictureSizes: Nullable<ProfilePictureSizes>
  updatedProfilePicture: { error: boolean; url: string }
  hasProfilePicture: boolean
  isOwner: boolean
  isArtist: boolean
  editMode: boolean
  name: string
  handle: string
  bio: string
  location: string
  twitterHandle: string
  instagramHandle: string
  tikTokHandle: string
  twitterVerified: boolean
  instagramVerified: boolean
  tikTokVerified: boolean
  website: string
  donation: string
  created: string
  onUpdateName: (name: string) => void
  onUpdateProfilePicture: (
    selectedFiles: any,
    source: 'original' | 'unsplash' | 'url'
  ) => Promise<void>
  onUpdateBio: (bio: string) => void
  onUpdateLocation: (location: string) => void
  onUpdateTwitterHandle: (handle: string) => void
  onUpdateInstagramHandle: (handle: string) => void
  onUpdateTikTokHandle: (handle: string) => void
  onUpdateWebsite: (website: string) => void
  onUpdateDonation: (donation: string) => void
  goToRoute: (route: string) => void
}

const ProfileWrapping = (props: ProfileWrappingProps) => {
  const {
    userId,
    isDeactivated,
    allowAiAttribution,
    loading,
    verified,
    profilePictureSizes,
    updatedProfilePicture,
    hasProfilePicture,
    isOwner,
    isArtist,
    editMode,
    name,
    handle,
    bio,
    location,
    twitterHandle,
    instagramHandle,
    tikTokHandle,
    twitterVerified,
    instagramVerified,
    tikTokVerified,
    website,
    donation,
    created,
    onUpdateName,
    onUpdateProfilePicture,
    onUpdateBio,
    onUpdateLocation,
    onUpdateTwitterHandle,
    onUpdateInstagramHandle,
    onUpdateTikTokHandle,
    onUpdateWebsite,
    onUpdateDonation,
    goToRoute
  } = props

  return (
    <div className={styles.profileWrapping}>
      <div className={styles.header}>
        <ProfilePicture
          userId={userId}
          updatedProfilePicture={
            updatedProfilePicture ? updatedProfilePicture.url : ''
          }
          error={updatedProfilePicture ? updatedProfilePicture.error : false}
          profilePictureSizes={isDeactivated ? null : profilePictureSizes}
          loading={loading}
          editMode={editMode}
          hasProfilePicture={hasProfilePicture}
          onDrop={onUpdateProfilePicture}
        />
        <div className={styles.nameWrapper}>
          <BadgeArtist
            className={cn(styles.badgeArtist, {
              [styles.hide]: !isArtist || loading || isDeactivated
            })}
          />
          {!isDeactivated && userId && (
            <>
              <EditableName
                className={editMode ? styles.editableName : null}
                name={name}
                editable={editMode}
                verified={verified}
                onChange={onUpdateName}
                userId={userId}
              />
              <div className={styles.handleWrapper}>
                <h2 className={styles.handle}>{handle}</h2>
                <FollowsYouBadge userId={userId} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.info}>
        {userId && (
          <ProfileLeftNav
            userId={userId}
            isDeactivated={isDeactivated}
            loading={loading}
            isOwner={isOwner}
            isArtist={isArtist}
            editMode={editMode}
            handle={handle}
            bio={bio}
            location={location}
            allowAiAttribution={allowAiAttribution}
            twitterHandle={twitterHandle}
            instagramHandle={instagramHandle}
            tikTokHandle={tikTokHandle}
            twitterVerified={twitterVerified}
            instagramVerified={instagramVerified}
            tikTokVerified={tikTokVerified}
            website={website}
            donation={donation}
            created={created}
            onUpdateBio={onUpdateBio}
            onUpdateLocation={onUpdateLocation}
            onUpdateTwitterHandle={onUpdateTwitterHandle}
            onUpdateInstagramHandle={onUpdateInstagramHandle}
            onUpdateTikTokHandle={onUpdateTikTokHandle}
            onUpdateWebsite={onUpdateWebsite}
            onUpdateDonation={onUpdateDonation}
            goToRoute={goToRoute}
          />
        )}
      </div>
    </div>
  )
}

export default ProfileWrapping
