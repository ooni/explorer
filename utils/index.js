export const sortByKey = (key) => {
  return (a, b) => {
    a = a[key];
    b = b[key];
    return (a < b) ? -1 : (a > b) ? 1 : 0
  }
}
