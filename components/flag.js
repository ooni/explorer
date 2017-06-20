import React from 'react'

export default class Flag extends React.Component {
  static propTypes = {
    countryCode: React.PropTypes.string.isRequired,
    withAsn: React.PropTypes.string,
    size: React.PropTypes.number
  }

	static defaultProps = {
    size: 100
	}
  constructor(props) {
    super(props)
  }

  render () {
    let { countryCode, size, withAsn } = this.props
    countryCode = countryCode.toLowerCase()
    return (
      <div>
        <div className="flag-container" style={{ height: `${size/2}px`, overflow: 'hidden' }}>
          <div className="country-container" style={{ width: `${size}px`, height: `${size/4}px` }}>
            <span>{countryCode.toUpperCase()}</span>
          </div>
          <img src={`/_/static/flags/png${size}px/${countryCode}.png`} />
          <div className="asn-container" style={{ width: `${size}px`, height: `${size/4}px` }}>
            <span>{withAsn}</span>
          </div>
        </div>
        <style jsx>{`
          .flag-container {
            position: relative
            border-radius: 15px;
          }
          .flag-container img {
          }
          .country-container {
            position: absolute;
            top: 0px;
            background-color: white;
            opacity: 0.7;
            text-align: center;
            padding-top: 3px;
            font-weight: bold;
          }
          .country-container > span {
            font-weight: bold;
            opacity: 1;
          }
          .asn-container {
            position: absolute;
            bottom: 0px;
            background-color: white;
            opacity: 0.7;
            text-align: center;
            padding-top: 3px;
          }
          .asn-container > span {
            font-weight: bold;
            opacity: 1;
          }
        `}</style>
      </div>
    )
  }
}
