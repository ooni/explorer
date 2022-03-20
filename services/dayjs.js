import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs
  .extend(utc)
  .extend(relativeTime)
  .extend(isSameOrBefore)

export default dayjs