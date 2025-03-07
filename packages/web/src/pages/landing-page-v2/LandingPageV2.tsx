import { useState, useEffect, useCallback } from 'react'

import cn from 'classnames'
import { ParallaxProvider } from 'react-scroll-parallax'

import { FanburstBanner } from 'components/banner/FanburstBanner'
import { CookieBanner } from 'components/cookie-banner/CookieBanner'
import FooterV2 from 'components/public-site/FooterV2'
import NavBannerV2 from 'components/public-site/NavBannerV2'
import { shouldShowCookieBanner, dismissCookieBanner } from 'utils/gdpr'
import { getPathname } from 'utils/route'

import styles from './LandingPageV2.module.css'
import ArtistInvestors from './components/ArtistInvestors'
import CTAGetStarted from './components/CTAGetStarted'
import CTAStartListening from './components/CTAStartListening'
// import CaseStudies from './components/CaseStudies'
import Description from './components/Description'
import FeaturedContent from './components/FeaturedContent'
import Hero from './components/Hero'
import PlatformFeatures from './components/PlatformFeatures'
import WhoUsesAudius from './components/WhoUsesAudius'

const FANBURST_UTM_SOURCE = 'utm_source=fanburst'

type LandingPageV2Props = {
  isMobile: boolean
  openNavScreen: () => void
  setRenderPublicSite: (shouldRender: boolean) => void
}

const LandingPageV2 = (props: LandingPageV2Props) => {
  useEffect(() => {
    document.documentElement.style.height = 'auto'
    return () => {
      document.documentElement.style.height = ''
    }
  })

  // Show Cookie Banner if in the EU
  const [showCookieBanner, setShowCookieBanner] = useState(false)
  useEffect(() => {
    shouldShowCookieBanner().then((show) => {
      setShowCookieBanner(show)
    })
  }, [])

  const onDismissCookiePolicy = useCallback(() => {
    dismissCookieBanner()
    setShowCookieBanner(false)
  }, [])

  // Show fanburst banner if url utm source is present
  const [showFanburstBanner, setShowFanburstBanner] = useState(false)
  useEffect(() => {
    if (
      window.location.search &&
      window.location.search.includes(FANBURST_UTM_SOURCE)
    ) {
      if (window.history && window.history.pushState) {
        window.history.pushState('', '/', getPathname())
      } else {
        window.location.hash = ''
      }
      setShowFanburstBanner(true)
    }
  }, [setShowFanburstBanner])
  const onDismissFanburstBanner = () => setShowFanburstBanner(false)

  const [hasImageLoaded, setHasImageLoaded] = useState(false)
  const onImageLoad = useCallback(() => {
    setHasImageLoaded(true)
  }, [setHasImageLoaded])

  return (
    <ParallaxProvider>
      <div
        id='landingPage'
        className={styles.container}
        style={{ opacity: hasImageLoaded ? 1 : 0 }}
      >
        {showCookieBanner && (
          <CookieBanner
            isMobile={props.isMobile}
            isPlaying={false}
            // @ts-ignore
            dismiss={onDismissCookiePolicy}
          />
        )}
        {showFanburstBanner && (
          <FanburstBanner
            isMobile={props.isMobile}
            onClose={onDismissFanburstBanner}
          />
        )}
        <NavBannerV2
          className={cn({
            [styles.hasBanner]: showFanburstBanner,
            [styles.isMobile]: props.isMobile
          })}
          isMobile={props.isMobile}
          openNavScreen={props.openNavScreen}
          setRenderPublicSite={props.setRenderPublicSite}
        />
        <Hero
          isMobile={props.isMobile}
          onImageLoad={onImageLoad}
          setRenderPublicSite={props.setRenderPublicSite}
        />
        <Description isMobile={props.isMobile} />
        <WhoUsesAudius isMobile={props.isMobile} />
        <PlatformFeatures isMobile={props.isMobile} />
        <ArtistInvestors isMobile={props.isMobile} />
        <CTAGetStarted
          isMobile={props.isMobile}
          setRenderPublicSite={props.setRenderPublicSite}
        />
        <FeaturedContent
          isMobile={props.isMobile}
          setRenderPublicSite={props.setRenderPublicSite}
        />
        {/* <CaseStudies
          isMobile={props.isMobile}
          setRenderPublicSite={props.setRenderPublicSite}
        /> */}
        <CTAStartListening
          isMobile={props.isMobile}
          setRenderPublicSite={props.setRenderPublicSite}
        />
        <FooterV2
          isMobile={props.isMobile}
          setRenderPublicSite={props.setRenderPublicSite}
        />
      </div>
    </ParallaxProvider>
  )
}

export default LandingPageV2
