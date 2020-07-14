export const buildQuery = (params) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    query.append(key, value)
  }
  return query.toString()
}
