import { useCallback } from 'react'

import {
  chatActions,
  accountSelectors,
  chatSelectors,
  ChatPermissionAction,
  cacheUsersSelectors,
  formatCount,
  useInboxUnavailableModal,
  trpc
} from '@audius/common'
import { useSelector } from 'audius-client/src/common/hooks/useSelector'
import { View, TouchableOpacity, Keyboard } from 'react-native'
import { useDispatch } from 'react-redux'

import IconBlockMessages from 'app/assets/images/iconBlockMessages.svg'
import IconKebabHorizontal from 'app/assets/images/iconKebabHorizontal.svg'
import IconUser from 'app/assets/images/iconUser.svg'
import { Text } from 'app/components/core'
import { ProfilePicture } from 'app/components/user'
import { UserBadges } from 'app/components/user-badges'
import { setVisibility } from 'app/store/drawers/slice'
import { makeStyles } from 'app/styles'

const { createChat } = chatActions
const { getCanCreateChat } = chatSelectors
const { getUserId } = accountSelectors
const { getUser } = cacheUsersSelectors

const messages = {
  followsYou: 'Follows You',
  followers: 'Followers',
  ctaNone: 'Cannot Be Messaged',
  ctaTip: 'Send a Tip To Message',
  ctaBlock: 'Blocked'
}

const useStyles = makeStyles(({ spacing, palette, typography }) => ({
  rootContainer: {
    backgroundColor: palette.white,
    flexGrow: 1
  },
  profilePicture: {
    height: spacing(18),
    width: spacing(18)
  },
  border: {
    borderBottomColor: palette.neutralLight8,
    borderBottomWidth: 1
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing(4)
  },
  userDetailsContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: spacing(2.5),
    gap: spacing(1)
  },
  topHalfContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  userNameContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1)
  },
  userName: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontByWeight.bold,
    color: palette.neutral
  },
  followContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  handle: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontByWeight.medium,
    color: palette.neutral
  },
  followersContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1)
  },
  ctaContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    backgroundColor: palette.neutralLight9,
    borderWidth: 1,
    borderColor: palette.neutralLight7,
    borderRadius: spacing(1),
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(1.5)
  },
  iconUser: {
    height: spacing(4),
    width: spacing(4),
    fill: palette.neutralLight4
  },
  iconBlock: {
    height: spacing(4),
    width: spacing(4),
    fill: palette.neutral
  },
  iconKebab: {
    height: spacing(6),
    width: spacing(6),
    fill: palette.neutral
  },
  followsYouTag: {
    letterSpacing: 0.64,
    borderWidth: 1,
    borderRadius: spacing(1),
    borderColor: palette.neutralLight4,
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2)
  },
  dim: {
    opacity: 0.5
  }
}))

const ctaToTextMap: Record<ChatPermissionAction, string> = {
  [ChatPermissionAction.TIP]: messages.ctaTip,
  [ChatPermissionAction.UNBLOCK]: messages.ctaBlock,
  [ChatPermissionAction.NONE]: messages.ctaNone,
  [ChatPermissionAction.WAIT]: messages.ctaNone,
  [ChatPermissionAction.NOT_APPLICABLE]: messages.ctaNone,
  [ChatPermissionAction.SIGN_UP]: messages.ctaNone
}

type ChatUserListItemProps = {
  userId: number
  presetMessage?: string
}

export const ChatUserListItem = ({
  userId,
  presetMessage
}: ChatUserListItemProps) => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => getUser(state, { id: userId }))
  const currentUserId = useSelector(getUserId)
  const { callToAction, canCreateChat } = useSelector((state) =>
    getCanCreateChat(state, { userId: user?.user_id })
  )
  const { onOpen: openInboxUnavailableDrawer } = useInboxUnavailableModal()

  const { data: relationship } = trpc.me.userRelationship.useQuery(
    {
      theirId: userId.toString()
    },
    {
      enabled: !!currentUserId
    }
  )

  const handlePress = useCallback(() => {
    if (user?.user_id) {
      Keyboard.dismiss()
      dispatch(
        createChat({
          userIds: [user.user_id],
          presetMessage,
          replaceNavigation: true
        })
      )
    }
  }, [dispatch, presetMessage, user?.user_id])

  const handleNotPermittedPress = useCallback(() => {
    if (user?.user_id) {
      Keyboard.dismiss()
      openInboxUnavailableDrawer({ userId: user.user_id, presetMessage })
    }
  }, [openInboxUnavailableDrawer, user, presetMessage])

  const handleKebabPress = useCallback(() => {
    if (user?.user_id) {
      Keyboard.dismiss()
      dispatch(
        setVisibility({
          drawer: 'CreateChatActions',
          visible: true,
          data: { userId: user.user_id }
        })
      )
    }
  }, [dispatch, user?.user_id])

  if (!user || currentUserId === user?.user_id) {
    return null
  }

  return (
    <TouchableOpacity
      onPress={canCreateChat ? handlePress : handleNotPermittedPress}
    >
      <View style={styles.border}>
        <View style={styles.userContainer}>
          <ProfilePicture
            profile={user}
            style={[styles.profilePicture, !canCreateChat ? styles.dim : null]}
          />
          <View style={styles.userDetailsContainer}>
            <View style={styles.topHalfContainer}>
              <View style={styles.userNameContainer}>
                <UserBadges user={user} nameStyle={styles.userName} />
                <Text style={styles.handle}>@{user.handle}</Text>
              </View>
              <TouchableOpacity onPress={handleKebabPress}>
                <IconKebabHorizontal
                  height={styles.iconKebab.height}
                  width={styles.iconKebab.width}
                  fill={styles.iconKebab.fill}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.followContainer}>
              <View style={styles.followersContainer}>
                {canCreateChat ? (
                  <>
                    <IconUser
                      fill={styles.iconUser.fill}
                      height={styles.iconUser.height}
                      width={styles.iconUser.width}
                    />
                    <Text fontSize='small' weight='bold' color='neutralLight4'>
                      {formatCount(user.follower_count)}
                    </Text>
                    <Text
                      fontSize='small'
                      color='neutralLight4'
                      weight='medium'
                    >
                      {messages.followers}
                    </Text>
                  </>
                ) : (
                  <View style={styles.ctaContainer}>
                    <IconBlockMessages
                      fill={styles.iconBlock.fill}
                      width={styles.iconBlock.width}
                      height={styles.iconBlock.height}
                    />
                    <Text style={styles.userName}>
                      {ctaToTextMap[callToAction]}
                    </Text>
                  </View>
                )}
              </View>
              {relationship?.followsMe && canCreateChat ? (
                <Text
                  fontSize='xxs'
                  weight='heavy'
                  color='neutralLight4'
                  textTransform='uppercase'
                  style={styles.followsYouTag}
                >
                  {messages.followsYou}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
