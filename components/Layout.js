import PropTypes from 'prop-types'
import { useMemo } from 'react'

import { StyledStickyNavBar } from 'components/SharedStyledComponents'
import { UserProvider } from 'hooks/useUser'
import { useRouter } from 'next/router'
import ConditionalWrapper from './ConditionalWrapper'
import Footer from './Footer'
import Header from './Header'
import NavBar from './NavBar'

const Layout = ({ children, isEmbeddedView }) => {
  const { pathname } = useRouter()

  const navbarColor = useMemo(() => {
    return pathname === '/' ||
      pathname.match(/^\/m\/\S+/) ||
      pathname.match(/^\/measurement\/\S+/)
      ? null
      : 'bg-blue-500'
  }, [pathname])

  const navbarSticky = useMemo(() => {
    return (
      pathname === '/countries' ||
      pathname === '/domains' ||
      pathname === '/human-rights' ||
      pathname === '/social-media' ||
      pathname === '/news-media' ||
      pathname === '/circumvention' ||
      pathname === '/networks' ||
      pathname === '/findings' ||
      pathname.match(/^\/country\/\S+/)
    )
  }, [pathname])

  return (
    <UserProvider>
      <div className="site flex flex-col min-h-[100vh]">
        <div className="flex-[1_0_auto]">
          <Header />
          {!isEmbeddedView && (
            <ConditionalWrapper
              condition={!!navbarSticky}
              wrapper={(children) => (
                <StyledStickyNavBar>{children}</StyledStickyNavBar>
              )}
            >
              <NavBar color={navbarColor} />
            </ConditionalWrapper>
          )}
          <div className={`content ${!navbarColor && 'mt-[-66px]'}`}>
            {children}
          </div>
        </div>
        {!isEmbeddedView && (
          <div className="flex-shrink-0">
            <Footer />
          </div>
        )}
      </div>
    </UserProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
}

export default Layout
