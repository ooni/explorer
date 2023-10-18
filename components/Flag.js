import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

var supportedCountryCodes = [
  'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au',
  'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl',
  'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc',
  'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv',
  'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg',
  'eh', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb',
  'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs',
  'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il',
  'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg',
  'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li',
  'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg',
  'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv',
  'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np',
  'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn',
  'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb',
  'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr',
  'ss', 'st', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk',
  'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'un',
  'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye',
  'yt', 'za', 'zm', 'zw']

const FlagImg = styled.img`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  clip-path: circle(50% at 50% 50%);
`

const FlagContainer = styled.div`
  border-radius: 50%;
  /* padding-left: 3px; */
  /* padding-top: 3px; */
  width: ${props => props.size + 2}px;
  height: ${props => props.size + 2}px;
  border: ${props => props.$border ? '1px solid white' : 'none'};
`

export const Flag = ({countryCode, size, border}) => {
  countryCode = countryCode.toLowerCase()
  if (supportedCountryCodes.indexOf(countryCode) === -1) {
    // Map unsupported country codes to ZZ
    countryCode = 'zz'
  }
  const src = `/static/flags/1x1/${countryCode}.svg`
  return (
    <FlagContainer className='country-flag' size={size} $border={border}>
      <FlagImg src={src} size={size} loading='lazy' />
    </FlagContainer>
  )
}

Flag.propTypes = {
  countryCode: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
}

Flag.defaultProps = {
  countryCode: 'zz',
  size: 60
}

export default Flag
