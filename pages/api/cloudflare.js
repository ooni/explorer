import axios from 'axios'
import dayjs from 'services/dayjs'

export default function handler(req, res) {
  const dateStart = req.query?.from
  const dateEnd = req.query?.to
  const location = req.query?.location

  if (!dayjs(dateStart).isValid() || dayjs(dateStart).isAfter(dayjs())) {
    return res.status(400).json('Invalid Start Date')
  }
  if (!dayjs(dateEnd).isValid() || dayjs(dateEnd).isAfter(dayjs())) {
    return res.status(400).json('Invalid End Date')
  }

  const diff = dayjs(dateEnd).diff(dayjs(dateStart), 'day')
  const aggInterval = diff <= 30 ? '1h' : '1d'

  axios({
    method:'get',
    url:`https://api.cloudflare.com/client/v4/radar/netflows/timeseries?name=all&product=all&dateStart=${dateStart}&dateEnd=${dateEnd}&location=${location}&name=http&product=http&dateStart=${dateStart}&dateEnd=${dateEnd}&location=${location}&aggInterval=${aggInterval}&normalization=MIN0_MAX`,
    headers: {
      'X-Auth-Key': process.env.CLOUDFLARE_TOKEN,
      'X-Auth-Email': process.env.CLOUDFLARE_EMAIL
    },
   }).then(({data}) => {
    console.log('cloudflareData', data)
    return res.status(200).json(data)
  }).catch((err) =>{
    console.log('error', err.response.data)
    return res.status(400).json(err)
  }) 
}