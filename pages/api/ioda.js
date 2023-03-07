import axios from 'axios'
import dayjs from 'services/dayjs'
import https from 'https'

const iodaHandler = (req, res) => {
  const dateStart = req.query?.from
  const dateEnd = req.query?.to
  const country = req.query?.country
  const asn = req.query?.asn

  if (country && asn) {
    return res.status(400).json('Country and asn can only be requested individually.')
  }
  // if (!dayjs(dateStart).isValid() || dayjs(dateStart).isAfter(dayjs()) || dayjs(dateStart).isAfter(dayjs(dateEnd))) {
  //   return res.status(400).json('Invalid Start Date')
  // }
  // if (!dayjs(dateEnd).isValid() || dayjs(dateEnd).isAfter(dayjs())) {
  //   return res.status(400).json('Invalid End Date')
  // }

  const diff = dayjs(dateEnd).diff(dayjs(dateStart), 'day')
  const aggInterval = diff <= 30 ? '1h' : '1d'
  const location = country || asn


  axios({
    method: 'get',
    url: `https://api.ioda.inetintel.cc.gatech.edu/v2/signals/raw/${country ? 'country' : 'asn'}/${location}?from=${dateStart}&until=${dateEnd}&sourceParams=WEB_SEARCH`,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  }).then(({data}) => {
    const result = data.data[0].map((item, i) => {
      const max = Math.max(...item.values)
      const values = item.values.map((val, i) => {
        const time = dayjs(item.from * 1000).add(item.step * i, 'second').utc().toISOString().split('.')[0]+'Z'
        return {x: time, y: val ? val / max : null}
      })
      return { datasource: item.datasource, values }
    })

    return res.status(200).json(result)
  }).catch((err) =>{
    return res.status(400).json(err)
  })
}

export default iodaHandler