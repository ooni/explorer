import PropTypes from 'prop-types'
import { useState } from 'react'
import { MdExpandLess } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import SocialButtons from '../SocialButtons'

const HideInLargeScreens = ({ children }) => (
  <div className="md:hidden">{children}</div>
)

const PageNavItem = ({ link, children }) => (
  <div className="mx-4 my-1">
    <a className="p-2 text-base text-blue-500" href={link}>
      {children}
    </a>
  </div>
)

const PageNavMenu = ({ countryCode }) => {
  const [isOpen, setOpen] = useState(true)

  return (
    <>
      {/* Show a trigger to open and close the nav menu, but hide it on desktops */}
      <HideInLargeScreens large xlarge>
        <MdExpandLess
          className={`cursor-pointer bg-gray-300 rounded-[50%] transition-transform ease-linear ${isOpen ? 'rotate-0' : 'rotate-180'}`}
          size={36}
          open={isOpen}
          onClick={() => setOpen(!isOpen)}
        />
      </HideInLargeScreens>
      {/* width={[1, 'unset']} */}
      <div className="w-100 py-2">
        {isOpen && (
          <div className="flex flex-col md:flex-row justify-center py-1">
            <PageNavItem link="#overview">
              <FormattedMessage id="Country.Heading.Overview" />
            </PageNavItem>
            <PageNavItem link="#websites">
              <FormattedMessage id="Country.Heading.Websites" />
            </PageNavItem>
            <PageNavItem link="#apps">
              <FormattedMessage id="Country.Heading.Apps" />
            </PageNavItem>
            <PageNavItem link="#outages">
              <FormattedMessage id="Country.Heading.Outages" />
            </PageNavItem>
          </div>
        )}
        <div className="flex justify-start md:justify-end md:px-4 py-1">
          <SocialButtons url={`country/${countryCode}`} />
        </div>
      </div>
    </>
  )
}

PageNavMenu.propTypes = {
  countryCode: PropTypes.string,
}

export default PageNavMenu
