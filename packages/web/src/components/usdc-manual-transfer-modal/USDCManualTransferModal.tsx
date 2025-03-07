import { useCallback, useContext } from 'react'

import {
  Name,
  useUSDCManualTransferModal,
  useCreateUserbankIfNeeded
} from '@audius/common'
import { Button, ButtonType } from '@audius/harmony'
import { IconError, LogoUSDC, ModalContent, ModalHeader } from '@audius/stems'
import cn from 'classnames'
import QRCode from 'react-qr-code'
import { useAsync } from 'react-use'

import { Icon } from 'components/Icon'
import { AddressTile } from 'components/address-tile'
import { ToastContext } from 'components/toast/ToastContext'
import { Text } from 'components/typography'
import { Hint } from 'components/withdraw-usdc-modal/components/Hint'
import ModalDrawer from 'pages/audio-rewards-page/components/modals/ModalDrawer'
import { track, make } from 'services/analytics'
import { audiusBackendInstance } from 'services/audius-backend/audius-backend-instance'
import { getUSDCUserBank } from 'services/solana/solana'
import { isMobile } from 'utils/clientUtil'
import { copyToClipboard } from 'utils/clipboardUtil'
import zIndex from 'utils/zIndex'

import styles from './USDCManualTransferModal.module.css'

const USDCLearnMore =
  'https://support.audius.co/help/Understanding-USDC-on-Audius'

const messages = {
  title: 'Manual Crypto Transfer',
  explainer1:
    'You can add funds manually by transferring USDC tokens to your Audius Wallet.',
  explainer2: 'Use caution to avoid errors and lost funds.',
  disclaimer:
    'You can only send Solana based (SPL) USDC tokens to this address.',
  learnMore: 'Learn More',
  copy: 'Copy Wallet Address',
  goBack: 'Go Back',
  copied: 'Copied to Clipboard!'
}

export const USDCManualTransferModal = () => {
  useCreateUserbankIfNeeded({
    recordAnalytics: track,
    audiusBackendInstance,
    mint: 'usdc'
  })
  const { isOpen, onClose } = useUSDCManualTransferModal()
  const { toast } = useContext(ToastContext)
  const mobile = isMobile()

  const { value: USDCUserBank } = useAsync(async () => {
    const USDCUserBankPubKey = await getUSDCUserBank()
    return USDCUserBankPubKey?.toString()
  })

  const handleCopy = useCallback(() => {
    copyToClipboard(USDCUserBank ?? '')
    toast(messages.copied)
    track(
      make({
        eventName: Name.PURCHASE_CONTENT_USDC_USER_BANK_COPIED,
        address: USDCUserBank ?? ''
      })
    )
  }, [USDCUserBank, toast])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <ModalDrawer
      zIndex={zIndex.USDC_MANUAL_TRANSFER_MODAL}
      size={'small'}
      onClose={handleClose}
      isOpen={isOpen}
      bodyClassName={styles.modal}
      useGradientTitle={false}
      dismissOnClickOutside
      isFullscreen={false}
    >
      <ModalHeader
        className={cn(styles.modalHeader, { [styles.mobile]: mobile })}
        onClose={onClose}
        showDismissButton={!mobile}
      >
        <Text
          variant='label'
          color='neutralLight2'
          size='xLarge'
          strength='strong'
          className={styles.title}
        >
          {messages.title}
        </Text>
      </ModalHeader>
      <ModalContent>
        <div className={styles.content}>
          <Text>{messages.explainer1}</Text>
          <Text>{messages.explainer2}</Text>
          <div className={cn(styles.columns, { [styles.mobile]: mobile })}>
            <div className={styles.qr}>
              {USDCUserBank ? <QRCode value={USDCUserBank} /> : null}
            </div>
            <div className={styles.data}>
              <AddressTile address={USDCUserBank ?? ''} left={<LogoUSDC />} />
              <Hint
                text={messages.disclaimer}
                link={USDCLearnMore}
                icon={() => (
                  <Icon icon={IconError} size='large' fill='neutral' />
                )}
                linkText={messages.learnMore}
              />
            </div>
          </div>
          <div
            className={cn(styles.buttonContainer, {
              [styles.mobile]: mobile
            })}
          >
            <Button variant={ButtonType.PRIMARY} fullWidth onClick={handleCopy}>
              {messages.copy}
            </Button>
            {mobile ? null : (
              <Button
                variant={ButtonType.TERTIARY}
                fullWidth
                onClick={handleClose}
              >
                {messages.goBack}
              </Button>
            )}
          </div>
        </div>
      </ModalContent>
    </ModalDrawer>
  )
}
