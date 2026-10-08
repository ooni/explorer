const isGreater = (key, x, y) => {
  const a = x[key]
  const b = y[key]
  return a < b ? -1 : a > b ? 1 : 0
}

// Time grain for a date range, used by the charts with a row per domain and
// when picking dates in MAT. A row per domain and day over years runs to
// millions of rows, more than the API can return. Most countries test
// ~2,500-2,800 domains a month (2026-10), so beyond the default 30-day daily
// view this keeps to at most 13 buckets. The API accepts year only for ranges
// over a year.
export const websitesTimeGrain = (since, until) => {
  const days = (Date.parse(until) - Date.parse(since)) / (24 * 60 * 60 * 1000)
  if (!(days > 31)) return 'day'
  if (days <= 13 * 7) return 'week'
  if (days <= 365) return 'month'
  return 'year'
}

export const sortByKey = (key, secondaryKey) => {
  return (a, b) => {
    const r = isGreater(key, a, b)
    if (secondaryKey === undefined) {
      return r
    }
    if (r === 0) {
      return isGreater(secondaryKey, a, b)
    }
    return r
  }
}

export const toCompactNumberUnit = (n) => {
  let unit = ''
  let value = n
  if (n >= 1000 * 1000) {
    value = Math.round((n / (1000 * 1000)) * 10) / 10
    unit = 'M'
  } else if (value > 100) {
    value = Math.round((n / 1000) * 10) / 10
    unit = 'k'
  }
  return { unit, value }
}

export const truncateString = (s, maxStart, maxEnd = 0) => {
  let truncatedString = ''
  if (maxStart + maxEnd > s.length) {
    return s
  }
  truncatedString += s.substr(0, maxStart - maxEnd)
  truncatedString += '…'
  truncatedString += s.substr(s.length - maxEnd, s.length)
  return truncatedString
}

export const getRange = (start, end) => {
  if (start === end || start > end) return [start]
  return [...Array(end - start + 1).keys()].map((idx) => idx + start)
}

export const formatLongDate = (date, locale) =>
  `${new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(date))}`

export const formatLongDateUTC = (date, locale) =>
  `${new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(date))} UTC`

export const formatMediumDateUTC = (date, locale) =>
  `${new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(date))} UTC`

export const formatTwoTuple = (ip, port) => {
  if (ip.indexOf(':')===-1)
    return `${ip}:${port}`;
  else
    return `[${ip}]:${port}`;
}
