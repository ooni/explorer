import PropTypes from 'prop-types'

const DefaultTestDetails = ({ render }) => (
  render({})
)

DefaultTestDetails.propTypes = {
  render: PropTypes.func
}

export default DefaultTestDetails
