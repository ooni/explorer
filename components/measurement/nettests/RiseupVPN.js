import PropTypes from 'prop-types'

const RiseupVPNDetails = ({
  render
}) => {
  return (
    render({
      status: 'reachable'
    })
  )
}

RiseupVPNDetails.propTypes = {
  render: PropTypes.func
}

export default RiseupVPNDetails
