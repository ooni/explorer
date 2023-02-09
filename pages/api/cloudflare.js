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

  return axios({
    method:'get',
    url:`https://api.cloudflare.com/client/v4/radar/netflows/timeseries?name=all&product=all&dateStart=${dateStart}&dateEnd=${dateEnd}&${targetParam}&aggInterval=${aggInterval}&normalization=MIN0_MAX`,
    headers: {
      'X-Auth-Key': process.env.CLOUDFLARE_TOKEN,
      'X-Auth-Email': process.env.CLOUDFLARE_EMAIL
    },
   }).then(({data, headers}) => {
    const result = data.result.all
    if (req.cache) {
      req.cache.set(cacheKey, {
        headers,
        data: result
      })
    }

    return res.status(200).json(result)
  }).catch((err) =>{
    return res.status(400).json(err)
  })
}

export default cache(cloudflareHandler)

// Example of a query to request all and http traffic at the same time
// `https://api.cloudflare.com/client/v4/radar/netflows/timeseries?name=all&product=all&dateStart=${dateStart}&dateEnd=${dateEnd}&location=${location}&name=http&product=http&dateStart=${dateStart}&dateEnd=${dateEnd}&location=${location}&aggInterval=${aggInterval}&normalization=MIN0_MAX`