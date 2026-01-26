import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import('dayjs/locale/de.js')
import('dayjs/locale/es.js')
import('dayjs/locale/fa.js')
import('dayjs/locale/fr.js')
import('dayjs/locale/is.js')
import('dayjs/locale/ru.js')
import('dayjs/locale/tr.js')
import('dayjs/locale/zh.js')

dayjs
  .extend(utc)
  .extend(relativeTime)
  .extend(isSameOrBefore)
  .extend(customParseFormat)

export default dayjs
