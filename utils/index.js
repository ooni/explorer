export const sortByKey = (key) => {
  return (a, b) => {
    a = a[key];
    b = b[key];
    return (a < b) ? -1 : (a > b) ? 1 : 0
  }
}

export const toCompactNumberUnit = (n) => {
  let unit = ''
  let value = n
  if (n > 1000*100) {
    value = Math.round((n / (1000 * 1000) * 10)) / 10
    unit = 'M'
  } else if (value > 100) {
    value = Math.round((n / (1000) * 10)) / 10
    unit = 'k'
  }
  return {unit, value}
}
