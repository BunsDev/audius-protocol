import {
  AMOUNT_PRESET,
  CUSTOM_AMOUNT,
  PayExtraAmountPresetValues,
  PayExtraPreset
} from '@audius/common'
import { SelectablePill } from '@audius/harmony'
import { useField } from 'formik'

import { PriceField } from 'components/form-fields/PriceField'
import { Text } from 'components/typography'

import styles from './PayExtraFormSection.module.css'

const messages = {
  payExtra: 'Pay Extra',
  customAmount: 'Custom Amount',
  placeholder: 'Enter a value'
}

const formatPillAmount = (val: number) => `$${Math.floor(val / 100)}`

export type PayExtraFormSectionProps = {
  amountPresets: PayExtraAmountPresetValues
  disabled?: boolean
}

export const PayExtraFormSection = ({
  amountPresets,
  disabled
}: PayExtraFormSectionProps) => {
  const [{ value: preset }, , { setValue: setPreset }] = useField(AMOUNT_PRESET)

  const handleClickPreset = (newPreset: PayExtraPreset) => {
    setPreset(newPreset === preset ? PayExtraPreset.NONE : newPreset)
  }

  return (
    <div className={styles.container}>
      <Text variant='title' color='neutralLight4' className={styles.title}>
        {messages.payExtra}
      </Text>
      <div className={styles.pillContainer}>
        <div className={styles.presetContainer}>
          <SelectablePill
            className={styles.presetPill}
            isSelected={preset === PayExtraPreset.LOW}
            label={formatPillAmount(amountPresets[PayExtraPreset.LOW])}
            size='large'
            type='button'
            onClick={() => handleClickPreset(PayExtraPreset.LOW)}
            disabled={disabled}
          />
          <SelectablePill
            className={styles.presetPill}
            isSelected={preset === PayExtraPreset.MEDIUM}
            label={formatPillAmount(amountPresets[PayExtraPreset.MEDIUM])}
            size='large'
            type='button'
            onClick={() => handleClickPreset(PayExtraPreset.MEDIUM)}
            disabled={disabled}
          />
          <SelectablePill
            className={styles.presetPill}
            isSelected={preset === PayExtraPreset.HIGH}
            label={formatPillAmount(amountPresets[PayExtraPreset.HIGH])}
            size='large'
            type='button'
            onClick={() => handleClickPreset(PayExtraPreset.HIGH)}
            disabled={disabled}
          />
        </div>
        <SelectablePill
          className={styles.customAmountPill}
          isSelected={preset === PayExtraPreset.CUSTOM}
          label={messages.customAmount}
          size='large'
          type='button'
          onClick={() => handleClickPreset(PayExtraPreset.CUSTOM)}
          disabled={disabled}
        />
      </div>
      {preset === PayExtraPreset.CUSTOM ? (
        <PriceField
          placeholder={messages.placeholder}
          label={messages.customAmount}
          name={CUSTOM_AMOUNT}
          disabled={disabled}
        />
      ) : null}
    </div>
  )
}
