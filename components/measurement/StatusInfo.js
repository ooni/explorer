import PropTypes from 'prop-types'
import {
  Flex,
  Box,
  Text
} from 'ooni-components'

const StatusInfo = ({ title, message}) => (
  <Flex flexDirection='column'>
    <Box mb={3}>
      <Text textAlign='center' fontSize={28}> {title} </Text>
    </Box>
    <Box>
      <Text textAlign='center' fontSize={20} fontWeight='bold' style={{whiteSpace:'pre'}}> {message} </Text>
    </Box>
  </Flex>
)

StatusInfo.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string
}

export default StatusInfo