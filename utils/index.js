const isGreater = (key, x, y) => {
  const a = x[key]
  const b = y[key]
  return a < b ? -1 : a > b ? 1 : 0
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
