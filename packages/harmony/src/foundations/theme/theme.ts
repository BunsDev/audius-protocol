import type { ColorTheme } from '../color'
import { colorTheme } from '../color'
import { CornerRadius, cornerRadius } from '../corner-radius'
import { Motion, motion } from '../motion'
import { Shadows, shadows } from '../shadows'
import { Spacing, spacing } from '../spacing'
import { typography } from '../typography'
import type { Typography } from '../typography'

import type { Theme } from './types'

const commonFoundations = {
  shadows,
  typography,
  cornerRadius,
  spacing,
  motion
}

export type HarmonyTheme = {
  type: Theme
  color: ColorTheme[keyof ColorTheme]
  shadows: Shadows
  typography: Typography
  cornerRadius: CornerRadius
  spacing: Spacing
  motion: Motion
}

export const dayTheme: HarmonyTheme = {
  type: 'day',
  color: colorTheme.day,
  ...commonFoundations
}

export const darkTheme: HarmonyTheme = {
  type: 'dark',
  color: colorTheme.dark,
  ...commonFoundations
}

export const matrixTheme: HarmonyTheme = {
  type: 'matrix',
  color: colorTheme.matrix,
  ...commonFoundations
}

export const themes = {
  day: dayTheme,
  dark: darkTheme,
  matrix: matrixTheme
}
