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

const SubNavItem = ({ label, href, ...props }) => {
  const { pathname } = useRouter()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(pathname === href)
  }, [pathname, href])

  return (
    <Link
      href={href}
      className={`${isActive && 'border-black'} text-black hover:border-black hover:text-gray7 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
      {...props}
    >
      {label}
    </Link>
  )
}

const SubMenu = () => {
  const { pathname } = useRouter()
  const [showSubMenu, setshowSubMenu] = useState(false)

  const menuItem = [
    {
      label: <FormattedMessage id="Navbar.SocialMedia" />,
      href: '/social-media',
      umami: 'navigation-social-media',
    },
    {
      label: <FormattedMessage id="Navbar.NewsMedia" />,
      href: '/news-media',
      umami: 'navigation-news-media',
    },
    // {
    //   label: <FormattedMessage id="Navbar.HumanRights" />,
    //   href: '/human-rights',
    //   umami: 'navigation-human-rights',
    // },
    {
      label: <FormattedMessage id="Navbar.Circumvention" />,
      href: '/circumvention',
      umami: 'navigation-circumvention',
    },
    {
      label: <FormattedMessage id="Navbar.Domains" />,
      href: '/domains',
      umami: 'navigation-domains"',
    },
    {
      label: <FormattedMessage id="Navbar.Networks" />,
      href: '/networks',
      umami: 'navigation-networks',
    },
  ]

  useEffect(() => {
    setshowSubMenu(menuItem.map((i) => i.href).includes(pathname))
  }, [pathname])

  return (
    <>
      {showSubMenu && (
        <div className="bg-gray-50">
          <div className="border-b border-gray-200">
            <div className="container">
              <nav className="-mb-px flex gap-x-8 flex-wrap">
                {menuItem.map((item) => (
                  <SubNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    data-umami-event={item.umami}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
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
    <div className="z-[8888]">
      <div className={`${color} py-4`}>
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
                className={`z-[9999] lg:block ${showMenu ? 'block overflow-y-scroll max-h-full p-8 fixed top-0 right-0 bg-gray-50' : 'hidden'}`}
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
                  className={`flex gap-4 lg:gap-8 text-sm ${showMenu && 'pt-2 flex-col items-start [&>a]:border-black [&>a]:hover:border-black [&>*]:opacity-100 [&>*]:text-black [&>*]:hover:text-black'}`}
                >
                  <NavItem
                    label={<FormattedMessage id="Navbar.Findings" />}
                    href="/findings"
                    data-umami-event="navigation-findings"
                  />
                  <NavItem
                    label={<FormattedMessage id="Navbar.Censorship" />}
                    href="/social-media"
                    data-umami-event="navigation-censorship"
                  />
                  <NavItem
                    label={<FormattedMessage id="Navbar.Countries" />}
                    href="/countries"
                    data-umami-event="navigation-countries"
                  />
                  <NavItem
                    label={<FormattedMessage id="Navbar.Charts" />}
                    href="/chart/mat"
                    data-umami-event="navigation-mat"
                  />
                  <NavItem
                    label={<FormattedMessage id="Navbar.Search" />}
                    href="/search"
                    data-umami-event="navigation-search"
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
      <SubMenu />
    </div>
  )
}

export default NavBar
