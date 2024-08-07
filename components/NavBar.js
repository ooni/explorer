import useUser from 'hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ExplorerLogo from 'ooni-components/svgs/logos/Explorer-HorizontalMonochromeInverted.svg'
import { useEffect, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import { FormattedMessage, useIntl } from 'react-intl'
import { getLocalisedLanguageName } from 'utils/i18nCountries'
import { getDirection } from './withIntl'

const LanguageSelect = (props) => (
  <select
    className="
      appearance-none
      bg-transparent
      text-gray-50
      opacity-60 
      cursor-pointer 
      capitalize 
      outline-none
      border-none
      p-0
      mb-1
      hover:opacity-100
    "
    {...props}
  />
)

const StyledNavItem = ({ isActive, ...props }) => (
  <Link
    className={`
        block
        cursor-pointer
        text-white
        hover:pb-1
        hover:text-white
        hover:opacity-100
        hover:border-b-2
        hover:border-white
        ${isActive ? 'pb-[4px] opacity-100 border-b-2 border-white' : 'pb-[6px] opacity-60'}`}
    {...props}
  />
)

const NavItem = ({ label, href, ...props }) => {
  const { pathname } = useRouter()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(pathname === href)
  }, [pathname, href])

  return (
    <StyledNavItem isActive={isActive} href={href} {...props}>
      {label}
    </StyledNavItem>
  )
}

const languages = process.env.LOCALES

export const NavBar = ({ color }) => {
  const { locale } = useIntl()
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { user, logout } = useUser()

  const [showMenu, setShowMenu] = useState(false)

  const handleLocaleChange = (event) => {
    const htmlEl = document.documentElement
    htmlEl.setAttribute('dir', getDirection(event.target.value))
    router.push({ pathname, query }, asPath, { locale: event.target.value })
  }

  const logoutUser = (e) => {
    e.preventDefault()
    setShowMenu(false)
    logout()
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setShowMenu(false)
  }, [pathname])

  return (
    <div className={`${color} z-[8888] py-4`}>
      <div className="container">
        <div className="flex flex-row justify-between items-end">
          <div className="z-[1] mb-1">
            <Link href="/">
              <ExplorerLogo height="26px" />
            </Link>
          </div>
          <div className="StyledResponsiveMenu">
            <MdMenu
              size="28px"
              className="lg:hidden cursor-pointer text-white"
              onClick={() => setShowMenu(!showMenu)}
            />
            <div
              className={`z-[9999] lg:block ${showMenu ? 'block overflow-y-scroll max-h-full p-8 text-base fixed top-0 right-0 bg-gray-50' : 'hidden'}`}
            >
              {showMenu && (
                <div className="flex justify-end">
                  <MdClose
                    size="28px"
                    className="cursor-pointer"
                    onClick={() => setShowMenu(!showMenu)}
                  />
                </div>
              )}
              <div
                className={`flex gap-4 lg:gap-8 ${showMenu && 'pt-2 flex-col items-start [&>a]:border-black [&>a]:hover:border-black [&>*]:opacity-100 [&>*]:text-black [&>*]:hover:text-black'}`}
              >
                <NavItem
                  label={<FormattedMessage id="Navbar.Search" />}
                  href="/search"
                  data-umami-event="navigation-search"
                />
                <NavItem
                  label={<FormattedMessage id="Navbar.Charts.MAT" />}
                  href="/chart/mat"
                  data-umami-event="navigation-mat"
                />
                <NavItem
                  label={<FormattedMessage id="Navbar.Charts.Circumvention" />}
                  href="/chart/circumvention"
                  data-umami-event="navigation-circumvention"
                />
                <NavItem
                  label={<FormattedMessage id="Navbar.Countries" />}
                  href="/countries"
                  data-umami-event="navigation-countries"
                />
                <NavItem
                  label={<FormattedMessage id="Navbar.Networks" />}
                  href="/networks"
                  data-umami-event="navigation-networks"
                />
                <NavItem
                  label={<FormattedMessage id="Navbar.Domains" />}
                  href="/domains"
                  data-umami-event="navigation-domains"
                />
                <NavItem
                  label={<FormattedMessage id="Navbar.Findings" />}
                  href="/findings"
                  data-umami-event="navigation-findings"
                />
                {user?.logged_in && (
                  <StyledNavItem href="" onClick={logoutUser}>
                    <FormattedMessage id="General.Logout" />
                  </StyledNavItem>
                )}
                <LanguageSelect onChange={handleLocaleChange} value={locale}>
                  {languages.map((c) => (
                    <option
                      className="text-inherit opacity-100"
                      key={c}
                      value={c}
                    >
                      {getLocalisedLanguageName(c, c)}
                    </option>
                  ))}
                </LanguageSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
