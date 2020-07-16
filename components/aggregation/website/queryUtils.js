export const paramsToQuery = (params) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    query.append(key, value)
  }
  return query.toString()
}

export const queryToParams = (query) => {
  const urlObj = new URLSearchParams(query)
  const params = {}
  for (const param of urlObj.keys()) {
    if (urlObj.getAll(param).length > 1) {
      params[param] = urlObj.getAll(param)
    } else {
      params[param] = urlObj.get(param)
    }
  }
  return params
}
