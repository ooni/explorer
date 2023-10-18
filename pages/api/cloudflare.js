import axios from 'axios'
import dayjs from 'services/dayjs'
import LRU from 'lru-cache'

const CACHE_MAX_SIZE = process.env.CACHE_MAX_SIZE || 100
const CACHE_MAX_AGE_IN_S = process.env.CACHE_MAX_AGE_IN_S || 60 * 60

const context = {
  cache: new LRU({
    max: CACHE_MAX_SIZE,
    ttl: CACHE_MAX_AGE_IN_S
  })
}

const cache = handler => (req, res) => {
  req.cache = context.cache
  return handler(req, res)
}

const cloudflareHandler = (req, res) => {
  const dateStart = req.query?.from
  const dateEnd = req.query?.to
  const country = req.query?.country
  const asn = req.query?.asn

  if (country && asn) {
    return res.status(400).json('Country and asn can only be requested individually.')
  }
  if (!dayjs(dateStart).isValid() || dayjs(dateStart).isAfter(dayjs()) || dayjs(dateStart).isAfter(dayjs(dateEnd))) {
    return res.status(400).json('Invalid Start Date')
  }
  if (!dayjs(dateEnd).isValid() || dayjs(dateEnd).isAfter(dayjs())) {
    return res.status(400).json('Invalid End Date')
  }

  const cacheKey = encodeURIComponent(req.url)

  if (req.cache.has(cacheKey)) {
    const { headers, data } = req.cache.get(cacheKey)
    res.setHeader('Cache-Control', `public,max-age=${CACHE_MAX_AGE_IN_S}`)
    res.setHeader('X-Cache', 'HIT')
    return res.json(data)
  }

  const diff = dayjs(dateEnd).diff(dayjs(dateStart), 'day')
  const aggInterval = diff <= 30 ? '1h' : '1d'
  const targetParam = asn ? `asn=${asn}` : `location=${country}`
  const formattedFrom = dateStart.split('.')[0]+'Z'
  const formattedTo = dateEnd.split('.')[0]+'Z'

  return axios({
    method:'get',
    url:`https://api.cloudflare.com/client/v4/radar/netflows/timeseries?name=all&product=all&dateStart=${formattedFrom}&dateEnd=${formattedTo}&${targetParam}&aggInterval=${aggInterval}&normalization=MIN0_MAX`,
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`
    },
   }).then(({data, headers}) => {
    const timestamps = data.result.all.timestamps
    const values = data.result.all.values
    const chartData = timestamps.map((st, i) => {
      return {
        'x': st,
        'y': Number(values[i])
      }
    })

    if (req.cache) {
      req.cache.set(cacheKey, {
        headers,
        data: chartData
      })
    }

    return res.status(200).json(chartData)
  }).catch((err) =>{
    const responseError = err?.response?.data?.errors[0]?.message || err.message
    return res.status(400).json(responseError)
  })
}

export default cache(cloudflareHandler)

// Example of a query to request all and http traffic at the same time
// `https://api.cloudflare.com/client/v4/radar/netflows/timeseries?name=all&product=all&dateStart=${dateStart}&dateEnd=${dateEnd}&location=${location}&name=http&product=http&dateStart=${dateStart}&dateEnd=${dateEnd}&location=${location}&aggInterval=${aggInterval}&normalization=MIN0_MAX`