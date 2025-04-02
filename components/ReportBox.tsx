import Link from 'next/link'
import { useIntl } from 'react-intl'
import { formatLongDate } from 'utils'
import { OONI_BLOG_BASE_URL } from './country/Overview'

type ReportBoxType = {
  title: string
  date: string
  link: string
}

const ReportBox = ({ title = '', date, link = '' }: ReportBoxType) => {
  const intl = useIntl()

  return (
    <Link href={OONI_BLOG_BASE_URL + link} className="flex text-black">
      <div className="flex justify-between flex-col py-6 px-6 border border-gray-300 border-b-[10px] border-b-blue-500">
        <h4 className="text-lg mb-2 leading-tight">{title}</h4>
        <div className="text-gray-600">{formatLongDate(date, intl.locale)}</div>
      </div>
    </Link>
  )
}
export default ReportBox
