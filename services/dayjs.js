import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import('dayjs/locale/de')
import('dayjs/locale/es')
import('dayjs/locale/fa')
import('dayjs/locale/fr')
import('dayjs/locale/is')
import('dayjs/locale/ru')
import('dayjs/locale/tr')
import('dayjs/locale/zh')

dayjs
  .extend(utc)
  .extend(relativeTime)
  .extend(isSameOrBefore)
  .extend(customParseFormat)

export default dayjs