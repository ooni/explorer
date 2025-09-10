import { useIntl } from 'react-intl'
import { FaExternalLinkAlt } from 'react-icons/fa'

export const APIButtons = ({ apiEndpoint }) => {
  const intl = useIntl()

  return (
    <div className="flex mt-4 justify-start md:justify-end">
      <a
        className="flex items-center"
        href={apiEndpoint}
        target="_blank"
        title="opens in new tab"
        rel="noreferrer"
      >
        {intl.formatMessage({ id: 'MAT.JSONData' })}
        <FaExternalLinkAlt className="ml-1" />
      </a>
      <a
        className="flex items-center ml-3"
        href={`${apiEndpoint}&format=CSV`}
        target="_blank"
        title="opens in new tab"
        rel="noreferrer"
      >
        {intl.formatMessage({ id: 'MAT.CSVData' })}
        <FaExternalLinkAlt className="ml-1" />
      </a>
    </div>
  )
}
