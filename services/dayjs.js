import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isBetween from 'dayjs/plugin/isBetween'

dayjs
  .extend(utc)
  .extend(relativeTime)
  .extend(isSameOrBefore)
  .extend(isBetween)

export default dayjs