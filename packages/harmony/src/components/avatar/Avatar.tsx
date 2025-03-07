import { CSSObject, useTheme } from '@emotion/react'

import type { AvatarProps } from './types'

export const Avatar = (props: AvatarProps) => {
  const {
    src,
    strokeWidth = 'default',
    size = 'auto',
    variant = 'default'
  } = props
  const { color } = useTheme()

  const sizeMap = {
    auto: '100%',
    small: '24px',
    large: '40px'
  }

  const strokeWidthMap = {
    thin: '1.2px',
    default: '2px'
  }

  const rootCss: CSSObject = {
    height: sizeMap[size],
    width: sizeMap[size],
    borderRadius: 'calc(infinity * 1px)',
    border: `${strokeWidthMap[strokeWidth]} solid ${color.border.default}`,
    boxShadow:
      variant === 'strong'
        ? '0px 0.5px 1.5px 0px rgba(0, 0, 0, 0.03), 0px 1.5px 5px 0px rgba(0, 0, 0, 0.08), 0px 6px 15px 0px rgba(0, 0, 0, 0.10)'
        : 'none',
    backgroundImage: `url(${src})`,
    backgroundColor: 'unset',
    backgroundSize: 'cover',
    position: 'relative',
    zIndex: 1
  }

  return <div css={rootCss} />
}
