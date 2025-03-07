import { Suspense, useEffect, useState, useCallback, lazy } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { AppState } from 'store/types'
import { getIsVisible } from './store/selectors'
import { closeVisualizer, toggleVisibility } from './store/slice'

import styles from './Visualizer.module.css'
import lazyWithPreload from 'utils/lazyWithPreload'
import { useHistory } from 'react-router-dom'
import {
  UPLOAD_PAGE,
  UPLOAD_ALBUM_PAGE,
  UPLOAD_PLAYLIST_PAGE
} from 'utils/route'
import useHotkeys from 'hooks/useHotkey'

export const NO_VISUALIZER_ROUTES = new Set([
  UPLOAD_PAGE,
  UPLOAD_ALBUM_PAGE,
  UPLOAD_PLAYLIST_PAGE
])

// Fetch the visualizer 1s after initial load
const VisualizerProvider = lazy(() => import('./VisualizerProvider'))

type VisualizerProps = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const Visualizer = ({
  isVisible,
  toggleVisibility,
  closeVisualizer
}: VisualizerProps) => {
  const { location } = useHistory()
  const { pathname } = location
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsLoaded(true)
    }
  }, [isVisible])

  const onToggleVisibility = useCallback(() => {
    // Don't toggle in the case that we are on a route that disables the visualizer
    if (NO_VISUALIZER_ROUTES.has(pathname)) return

    toggleVisibility()
  }, [toggleVisibility, pathname])

  const onCloseVisualizer = useCallback(() => {
    closeVisualizer()
  }, [closeVisualizer, pathname])

  useHotkeys({
    27 /* ESC */: onCloseVisualizer,
    86 /* v */: onToggleVisibility
  })

  return isLoaded ? (
    <Suspense fallback={<div className={styles.fallback} />}>
      <VisualizerProvider isVisible={isVisible} onClose={onCloseVisualizer} />
    </Suspense>
  ) : null
}

function mapStateToProps(state: AppState) {
  return {
    isVisible: getIsVisible(state)
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    toggleVisibility: () => dispatch(toggleVisibility()),
    closeVisualizer: () => dispatch(closeVisualizer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Visualizer)
