import axios from 'axios'

const createApiRequest = () => {
  const client = axios.create({
    baseURL: process.env.MEASUREMENTS_URL // eslint-disable-line
  })

  const cancelTokenSource = axios.CancelToken.source()
  return {
    client,
    cancelTokenSource
  }
}

export default createApiRequest
