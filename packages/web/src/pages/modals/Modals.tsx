import { ComponentType, lazy } from 'react'

import { Client } from '@audius/common'
import type { Modals as ModalTypes } from '@audius/common'

import AddToPlaylistModal from 'components/add-to-playlist/desktop/AddToPlaylistModal'
import { AiAttributionSettingsModal } from 'components/ai-attribution-settings-modal'
import AppCTAModal from 'components/app-cta-modal/AppCTAModal'
import BrowserPushConfirmationModal from 'components/browser-push-confirmation-modal/BrowserPushConfirmationModal'
import { BuyAudioModal } from 'components/buy-audio-modal/BuyAudioModal'
import { BuyAudioRecoveryModal } from 'components/buy-audio-modal/BuyAudioRecoveryModal'
import CollectibleDetailsModal from 'components/collectibles/components/CollectibleDetailsModal'
import ConfirmerPreview from 'components/confirmer-preview/ConfirmerPreview'
import DeletePlaylistConfirmationModal from 'components/delete-playlist-confirmation-modal/DeletePlaylistConfirmationModal'
import DiscoveryNodeSelection from 'components/discovery-node-selection/DiscoveryNodeSelection'
import { DuplicateAddConfirmationModal } from 'components/duplicate-add-confirmation-modal'
import EditFolderModal from 'components/edit-folder-modal/EditFolderModal'
import EmbedModal from 'components/embed-modal/EmbedModal'
import { FeatureFlagOverrideModal } from 'components/feature-flag-override-modal'
import FirstUploadModal from 'components/first-upload-modal/FirstUploadModal'
import { InboxUnavailableModal } from 'components/inbox-unavailable-modal/InboxUnavailableModal'
import { LeavingAudiusModal } from 'components/leaving-audius-modal/LeavingAudiusModal'
import { LockedContentModal } from 'components/locked-content-modal/LockedContentModal'
import PasswordResetModal from 'components/password-reset/PasswordResetModal'
import { PremiumContentPurchaseModal } from 'components/premium-content-purchase-modal/PremiumContentPurchaseModal'
import ShareSoundToTikTokModal from 'components/share-sound-to-tiktok-modal/ShareSoundToTikTokModal'
import { TipAudioModal } from 'components/tipping/tip-audio/TipAudioModal'
import ConnectedMobileOverflowModal from 'components/track-overflow-modal/ConnectedMobileOverflowModal'
import { TransactionDetailsModal } from 'components/transaction-details-modal'
import UnfollowConfirmationModal from 'components/unfollow-confirmation-modal/UnfollowConfirmationModal'
import UnloadDialog from 'components/unload-dialog/UnloadDialog'
import { UploadConfirmationModal } from 'components/upload-confirmation-modal'
import { USDCManualTransferModal } from 'components/usdc-manual-transfer-modal/USDCManualTransferModal'
import { USDCPurchaseDetailsModal } from 'components/usdc-purchase-details-modal/USDCPurchaseDetailsModal'
import { USDCTransactionDetailsModal } from 'components/usdc-transaction-details-modal/USDCTransactionDetailsModal'
import TierExplainerModal from 'components/user-badges/TierExplainerModal'
import ConnectedUserListModal from 'components/user-list-modal/ConnectedUserListModal'
import { WithdrawUSDCModal } from 'components/withdraw-usdc-modal/WithdrawUSDCModal'
import AudioBreakdownModal from 'pages/audio-rewards-page/components/modals/AudioBreakdownModal'
import { ChallengeRewardsModal } from 'pages/audio-rewards-page/components/modals/ChallengeRewardsModal'
import TopAPIModal from 'pages/audio-rewards-page/components/modals/TopAPI'
import TransferAudioMobileDrawer from 'pages/audio-rewards-page/components/modals/TransferAudioMobileDrawer'
import { VipDiscordModal } from 'pages/audio-rewards-page/components/modals/VipDiscordModal'
import { getClient } from 'utils/clientUtil'

import { AppModal } from './AppModal'

const ShareModal = lazy(() => import('components/share-modal'))

const EditPlaylistModal = lazy(
  () => import('components/edit-playlist/desktop/EditPlaylistModal')
)
const HCaptchaModal = lazy(
  () => import('pages/audio-rewards-page/components/modals/HCaptchaModal')
)
const StripeOnRampModal = lazy(() => import('components/stripe-on-ramp-modal'))

const CreateChatModal = lazy(
  () => import('pages/chat-page/components/CreateChatModal')
)

const TrendingRewardsModal = lazy(
  () => import('pages/audio-rewards-page/components/modals/TrendingRewards')
)

const EditTrackModal = lazy(
  () => import('components/edit-track/EditTrackModal')
)
const InboxSettingsModal = lazy(
  () => import('components/inbox-settings-modal/InboxSettingsModal')
)

const commonModalsMap: { [Modal in ModalTypes]?: ComponentType } = {
  Share: ShareModal,
  VipDiscord: VipDiscordModal,
  EditFolder: EditFolderModal,
  EditPlaylist: EditPlaylistModal,
  EditTrack: EditTrackModal,
  AddToPlaylist: AddToPlaylistModal,
  TiersExplainer: TierExplainerModal,
  DeletePlaylistConfirmation: DeletePlaylistConfirmationModal,
  DuplicateAddConfirmation: DuplicateAddConfirmationModal,
  AudioBreakdown: AudioBreakdownModal,
  UploadConfirmation: UploadConfirmationModal,
  BuyAudio: BuyAudioModal,
  BuyAudioRecovery: BuyAudioRecoveryModal,
  TransactionDetails: TransactionDetailsModal,
  InboxSettings: InboxSettingsModal,
  LockedContent: LockedContentModal,
  HCaptcha: HCaptchaModal,
  APIRewardsExplainer: TopAPIModal,
  TrendingRewardsExplainer: TrendingRewardsModal,
  ChallengeRewardsExplainer: ChallengeRewardsModal,
  TransferAudioMobileWarning: TransferAudioMobileDrawer,
  BrowserPushPermissionConfirmation: BrowserPushConfirmationModal,
  ShareSoundToTikTok: ShareSoundToTikTokModal,
  AiAttributionSettings: AiAttributionSettingsModal,
  PremiumContentPurchaseModal,
  LeavingAudiusModal,
  CreateChatModal,
  InboxUnavailableModal,
  WithdrawUSDCModal,
  StripeOnRamp: StripeOnRampModal,
  USDCPurchaseDetailsModal,
  USDCTransactionDetailsModal,
  USDCManualTransferModal
}

const commonModals = Object.entries(commonModalsMap) as [
  ModalTypes,
  ComponentType
][]

const Modals = () => {
  const client = getClient()
  const isMobileClient = client === Client.MOBILE

  return (
    <>
      {commonModals.map(([modalName, Modal]) => {
        return <AppModal key={modalName} name={modalName} modal={Modal} />
      })}
      <PasswordResetModal />
      <FirstUploadModal />
      <UnloadDialog />
      <CollectibleDetailsModal />

      {!isMobileClient && (
        <>
          <EmbedModal />
          <ConnectedUserListModal />
          <AppCTAModal />
          {/* dev-mode hot-key modals */}
          <ConfirmerPreview />
          <DiscoveryNodeSelection />
          <FeatureFlagOverrideModal />
        </>
      )}

      {isMobileClient && (
        <>
          <ConnectedMobileOverflowModal />
          <UnfollowConfirmationModal />
        </>
      )}

      <TipAudioModal />
    </>
  )
}

export default Modals
