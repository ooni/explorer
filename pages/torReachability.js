import React from 'react'
import Head from 'next/head'

import reactVizStyle from 'react-vis/dist/styles/plot.scss'

import Layout from '../components/layout'
import TorReachability from '../components/torReachability.js'

import { tsvParse } from 'd3-dsv'
import { timeParse } from 'd3-time-format'
import { timeDay } from 'd3-time'
import 'isomorphic-fetch'
import {countries} from 'country-data'

const analyzeData = (data, startDate, endDate, includeCountries) => {
  let result = {}
  let byCountry = {}
  data.forEach((entry) => {
    const tst = entry.test_start_time
    const timestamp = new Date(tst.getUTCFullYear(), tst.getUTCMonth(), tst.getUTCDate()).getTime()
    byCountry[entry.probe_cc] = byCountry[entry.probe_cc] || {}
    byCountry[entry.probe_cc][timestamp] = byCountry[entry.probe_cc][timestamp] || {
        'success': 0,
        'error': 0,
        'failed': 0,
        'measurements': []
    }

    if (entry.status === true) {
      byCountry[entry.probe_cc][timestamp]['success'] += 1
    } else if (entry.status === false) {
      byCountry[entry.probe_cc][timestamp]['failed'] += 1
    } else {
      byCountry[entry.probe_cc][timestamp]['error'] += 1
    }
    byCountry[entry.probe_cc][timestamp]['measurements'].push({
      report_id: entry.report_id,
      test_start_time: entry.test_start_time
    })
  })
  let success, failed, error, dataExists
  for (const cc of Object.keys(byCountry)) {
    success = []
    failed = []
    error = []
    dataExists = false
    for (const day of timeDay.every(1).range(startDate, endDate)) {
      const timestamp = day.getTime()
      let s = 0,
          f = 0,
          e = 0
      if (byCountry[cc][timestamp] !== undefined) {
        s = byCountry[cc][timestamp]['success']
        f = byCountry[cc][timestamp]['failed']
        e = byCountry[cc][timestamp]['error']
      }
      success.push({
        'y': s,
        'x': +timestamp
      })
      failed.push({
        'y': f,
        'x': +timestamp
      })
      error.push({
        'y': e,
        'x': +timestamp
      })
      if (s > 0 || e > 0 || f > 0) {
        dataExists = true
      }
    }
    if (dataExists === false || cc === 'ZZ') {
      continue
    }
    if (includeCountries && includeCountries.indexOf(cc) === -1) {
      continue
    }
    result[cc] = [
      success.slice(),
      failed.slice(),
      error.slice()
    ]
  }
  return result
}

const getTorData = async () => {
  const dt = await fetch('http://localhost:3000/_/data/vanilla-tor-success.tsv')
  const text = await dt.text()
  const data = tsvParse(text, (d) => {
    let status = null
    if (d.status === 'true') {
      status = true
    } else if (d.status === 'false') {
      status = false
    }
    let parseTime = timeParse('%Y-%m-%d %H:%M:%S.000000')
    return {
      probe_cc: d.probe_cc,
      probe_asn: d.probe_asn,
      measurement_start_time: parseTime(d.measurement_start_time),
      report_id: d.report_id,
      status: status,
      test_runtime: +d.test_runtime,
      test_start_time: parseTime(d.test_start_time)
    }
  })
  return data
}

const calcSummary = (byCountry) => {
  let summary = {}
  Object.keys(byCountry).forEach((cc) => {
    let status = null
    let msmtCount = 0
    const timestamps = Object.keys(byCountry[cc])
    for (let i = byCountry[cc][0].length - 1;i > 0;i--) {
      // We look at the last 7 measurements
      if (msmtCount >= 7) {
        break
      }
      const success = byCountry[cc][0][i].y
      const failed  = byCountry[cc][1][i].y
      if (success === 0 && failed === 0) {
        continue
      }
      console.log(cc)
      console.log('success', success)
      console.log('failed', failed)
      msmtCount += 1
      if (success > failed) {
        if (status === 'red' || status === 'orange') {
          status = 'orange'
        } else {
          status = 'green'
        }
      } else {
        if (status === 'orange' || status === 'green') {
          status = 'orange'
        } else {
          status = 'red'
        }
      }
    }
    summary[cc] = {'status': status}
  })
  return summary
}

export default class TorReachabilityPage extends React.Component {
  static async getInitialProps({query}) {
    let endDate = new Date()
    let startDate = timeDay.offset(endDate, -90)
    let includeCountries
    if (query.startDate) {
      startDate = timeParse('%Y-%m-%d')(query.startDate)
    }
    if (query.endDate) {
      endDate = timeParse('%Y-%m-%d')(query.endDate)
    }
    if (query.country) {
      if (typeof query.country === 'string') {
        includeCountries = [query.country]
      } else {
        includeCountries = query.country
      }
    }
    let props = {}
    let data = await getTorData()
    props.byCountry = analyzeData(data, startDate, endDate, includeCountries)
    props.summary = calcSummary(props.byCountry)
    props.ready = true
    return props
  }

  render() {
    const {byCountry, summary} = this.props
    return (
      <Layout>
        <Head>
          <title>OONI Explorer - Tor reachability</title>
          <style dangerouslySetInnerHTML={{ __html: reactVizStyle }} />
        </Head>
        <div>
        <div>
        {Object.keys(summary).map((cc) => {
          return (
            <div key={`summary-${cc}`}>
              <h2>{countries[cc].name}</h2>
              <p>Status: {summary[cc].status}</p>
            </div>
          )
        })}
        </div>

        {Object.keys(byCountry).map((cc) => {
          return (
            <div key={`graph-${cc}`}>
              <h2>{countries[cc].name}</h2>
              <TorReachability data={byCountry[cc]}/>
            </div>
          )
        })}
        </div>
      </Layout>
    )
  }

}
