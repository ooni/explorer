import PropTypes from 'prop-types'
import { MdShare } from 'react-icons/md'
import { useIntl } from 'react-intl'

const SocialButtons = ({ url }) => {
  const intl = useIntl()

  return (
    <div className="flex gap-2 items-center">
      <MdShare height="20px" width="20px" />
      <div>
        {intl.formatMessage(
          { id: 'SocialButtons.CTA' },
          {
            'facebook-link': (string) => (
              <a
                className="text-blue-700 hover:text-blue-700"
                target="_blank"
                href={`https://www.facebook.com/sharer/sharer.php?u=https://explorer.ooni.org/${url}`}
                rel="noreferrer"
              >
                {string}
              </a>
            ),
            'twitter-link': (string) => (
              <a
                className="text-blue-700 hover:text-blue-700"
                target="_blank"
                href={`https://twitter.com/intent/tweet?text=${intl.formatMessage({ id: 'SocialButtons.Text' })}&url=https://explorer.ooni.org/${url}`}
                rel="noreferrer"
              >
                {string}
              </a>
            ),
          },
        )}
      </div>
    </div>
  )
}

SocialButtons.propTypes = {
  url: PropTypes.string.isRequired,
}

export default SocialButtons
