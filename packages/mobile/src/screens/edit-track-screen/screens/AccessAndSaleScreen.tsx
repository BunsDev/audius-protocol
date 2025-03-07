import { useCallback, useMemo, useState } from 'react'

import type { Nullable, PremiumConditions } from '@audius/common'
import {
  TrackAvailabilityType,
  isPremiumContentFollowGated,
  isPremiumContentTipGated,
  isPremiumContentCollectibleGated,
  FeatureFlags,
  removeNullable,
  isPremiumContentUSDCPurchaseGated,
  useAccessAndRemixSettings
} from '@audius/common'
import { useField, useFormikContext } from 'formik'
import moment from 'moment'

import IconCaretLeft from 'app/assets/images/iconCaretLeft.svg'
import IconCart from 'app/assets/images/iconCart.svg'
import { Button } from 'app/components/core'
import { HelpCallout } from 'app/components/help-callout/HelpCallout'
import { useNavigation } from 'app/hooks/useNavigation'
import { useFeatureFlag } from 'app/hooks/useRemoteConfig'
import { TopBarIconButton } from 'app/screens/app-screen'
import { makeStyles } from 'app/styles'

import { CollectibleGatedAvailability } from '../components/CollectibleGatedAvailability'
import { HiddenAvailability } from '../components/HiddenAvailability'
import { SpecialAccessAvailability } from '../components/SpecialAccessAvailability'
import { PremiumRadioField } from '../fields/AccessAndSaleField/PremiumRadioField/PremiumRadioField'
import { TRACK_PREVIEW } from '../fields/AccessAndSaleField/PremiumRadioField/TrackPreviewField'
import { TRACK_PRICE } from '../fields/AccessAndSaleField/PremiumRadioField/TrackPriceField'
import { PublicAvailabilityRadioField } from '../fields/AccessAndSaleField/PublicAvailabilityRadioField'
import type { FormValues, RemixOfField } from '../types'

import type { ListSelectionData } from './ListSelectionScreen'
import { ListSelectionScreen } from './ListSelectionScreen'

const messages = {
  title: 'Access & Sale',
  description:
    "Hidden tracks won't show up on your profile. Anyone who has the link will be able to listen.",
  hideTrack: 'Hide Track',
  showGenre: 'Show Genre',
  showMood: 'Show Mood',
  showTags: 'Show Tags',
  showShareButton: 'Show Share Button',
  showPlayCount: 'Show Play Count',
  markedAsRemix:
    'This track is marked as a remix. To enable additional availability options, unmark within Remix Settings.',
  done: 'Done'
}

const publicAvailability = TrackAvailabilityType.PUBLIC
const premiumAvailability = TrackAvailabilityType.USDC_PURCHASE
const specialAccessAvailability = TrackAvailabilityType.SPECIAL_ACCESS
const collectibleGatedAvailability = TrackAvailabilityType.COLLECTIBLE_GATED
const hiddenAvailability = TrackAvailabilityType.HIDDEN

const useStyles = makeStyles(({ spacing }) => ({
  backButton: {
    marginLeft: -6
  },
  isRemix: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing(4),
    marginHorizontal: spacing(4),
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4)
  },
  listItem: {
    paddingVertical: spacing(6)
  }
}))

const MarkedAsRemix = () => {
  const styles = useStyles()
  const [{ value: remixOf }] = useField<RemixOfField>('remix_of')

  return remixOf ? (
    <HelpCallout style={styles.isRemix} content={messages.markedAsRemix} />
  ) : null
}

export const AccessAndSaleScreen = () => {
  const styles = useStyles()
  const navigation = useNavigation()
  const { initialValues } = useFormikContext<FormValues>()
  const [{ value: premiumConditions }] =
    useField<Nullable<PremiumConditions>>('premium_conditions')
  const [{ value: isUnlisted }] = useField<boolean>('is_unlisted')
  const [{ value: remixOf }] = useField<RemixOfField>('remix_of')
  const isRemix = !!remixOf
  const [{ value: releaseDate }] = useField<Nullable<string>>('release_date')
  const isScheduledRelease =
    releaseDate === null ? false : moment(releaseDate).isAfter(moment())

  const { isEnabled: isUsdcEnabled } = useFeatureFlag(
    FeatureFlags.USDC_PURCHASES
  )
  const { isEnabled: isUsdcUploadEnabled } = useFeatureFlag(
    FeatureFlags.USDC_PURCHASES_UPLOAD
  )

  const isUpload = !initialValues?.track_id
  const initialPremiumConditions = initialValues?.premium_conditions ?? null
  const initialAvailability = useMemo(() => {
    if (isUsdcEnabled && isPremiumContentUSDCPurchaseGated(premiumConditions)) {
      return TrackAvailabilityType.USDC_PURCHASE
    }
    if (isPremiumContentCollectibleGated(premiumConditions)) {
      return TrackAvailabilityType.COLLECTIBLE_GATED
    }
    if (
      isPremiumContentFollowGated(premiumConditions) ||
      isPremiumContentTipGated(premiumConditions)
    ) {
      return TrackAvailabilityType.SPECIAL_ACCESS
    }
    if (isUnlisted || isScheduledRelease) {
      return TrackAvailabilityType.HIDDEN
    }
    return TrackAvailabilityType.PUBLIC
    // we only care about what the initial value was here
    // eslint-disable-next-line
  }, [])

  const {
    noUsdcGate: noUsdcGateOption,
    noSpecialAccessGate,
    noSpecialAccessGateFields,
    noCollectibleGate,
    noCollectibleGateFields,
    noHidden
  } = useAccessAndRemixSettings({
    isUpload,
    isRemix,
    initialPremiumConditions,
    isInitiallyUnlisted: initialValues.is_unlisted,
    isScheduledRelease
  })

  const noUsdcGate = noUsdcGateOption || !isUsdcUploadEnabled

  const [availability, setAvailability] =
    useState<TrackAvailabilityType>(initialAvailability)

  const previousPremiumConditions = useMemo(
    () => premiumConditions ?? initialPremiumConditions,
    // we only care about what the initial value was here
    // eslint-disable-next-line
    []
  )

  const data: ListSelectionData[] = [
    {
      label: publicAvailability,
      value: publicAvailability,
      disabled: isScheduledRelease
    },
    isUsdcEnabled
      ? {
          label: premiumAvailability,
          value: premiumAvailability,
          disabled: noUsdcGate || isScheduledRelease
        }
      : null,
    {
      label: specialAccessAvailability,
      value: specialAccessAvailability,
      disabled: noSpecialAccessGate || isScheduledRelease
    },
    {
      label: collectibleGatedAvailability,
      value: collectibleGatedAvailability,
      disabled: noCollectibleGate || isScheduledRelease
    },
    {
      label: hiddenAvailability,
      value: hiddenAvailability,
      disabled: noHidden
    }
  ].filter(removeNullable)
  const items = {
    [publicAvailability]: (
      <PublicAvailabilityRadioField
        selected={availability === TrackAvailabilityType.PUBLIC}
        disabled={isScheduledRelease}
      />
    )
  }

  if (isUsdcEnabled) {
    items[premiumAvailability] = (
      <PremiumRadioField
        selected={availability === TrackAvailabilityType.USDC_PURCHASE}
        disabled={noUsdcGate || isScheduledRelease}
        disabledContent={noUsdcGate}
        previousPremiumConditions={previousPremiumConditions}
      />
    )
  }

  items[specialAccessAvailability] = (
    <SpecialAccessAvailability
      selected={availability === TrackAvailabilityType.SPECIAL_ACCESS}
      disabled={noSpecialAccessGate || isScheduledRelease}
      disabledContent={noSpecialAccessGateFields}
      previousPremiumConditions={previousPremiumConditions}
    />
  )

  items[collectibleGatedAvailability] = (
    <CollectibleGatedAvailability
      selected={availability === TrackAvailabilityType.COLLECTIBLE_GATED}
      disabled={noCollectibleGate || isScheduledRelease}
      disabledContent={noCollectibleGateFields}
      previousPremiumConditions={previousPremiumConditions}
    />
  )

  items[hiddenAvailability] = (
    <HiddenAvailability
      selected={availability === TrackAvailabilityType.HIDDEN}
      disabled={noHidden}
    />
  )

  /**
   * Do not navigate back if:
   * - track is collectible gated and user has not selected an nft collection, or
   * - track is usdc purchase gated and user has not selected a valid price or preview
   */
  const [{ value: price }, { error: priceError }] = useField(TRACK_PRICE)
  const [{ value: preview }, { error: previewError }] = useField(TRACK_PREVIEW)

  const usdcGateIsInvalid = useMemo(() => {
    // first time user selects usdc purchase option
    const priceNotSet = price === null
    const previewNotSet = preview === null
    return (
      isPremiumContentUSDCPurchaseGated(premiumConditions) &&
      (!!priceError || priceNotSet || !!previewError || previewNotSet)
    )
  }, [premiumConditions, price, priceError, preview, previewError])

  const collectibleGateHasNoSelectedCollection = useMemo(
    () =>
      isPremiumContentCollectibleGated(premiumConditions) &&
      !premiumConditions.nft_collection,
    [premiumConditions]
  )
  const isFormInvalid =
    usdcGateIsInvalid || collectibleGateHasNoSelectedCollection

  const goBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <ListSelectionScreen
      data={data}
      renderItem={({ item }) => items[item.label]}
      screenTitle={messages.title}
      icon={IconCart}
      value={availability}
      onChange={setAvailability}
      disableSearch
      allowDeselect={false}
      hideSelectionLabel
      topbarLeft={
        <TopBarIconButton
          icon={IconCaretLeft}
          style={styles.backButton}
          onPress={isFormInvalid ? undefined : goBack}
        />
      }
      header={<MarkedAsRemix />}
      itemStyles={styles.listItem}
      bottomSection={
        <Button
          variant='primary'
          size='large'
          fullWidth
          title={messages.done}
          onPress={goBack}
          disabled={isFormInvalid}
        />
      }
    />
  )
}
