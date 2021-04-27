import React from 'react'
import styled from 'styled-components'
import { MdFeedback } from 'react-icons/md'
import { theme, Flex } from 'ooni-components'

import sentry from '../utils/sentry'
const { Sentry } = sentry()

const StyledFeedbackButton = styled(Flex)`
  position:fixed;
  right:10px;
  bottom:10px;
  cursor:pointer;
  width:50px;
  height:50px;
  background-color: ${props => props.theme.colors.gray9};
  opacity: 0.8;
  -webkit-border-radius:60px;
  -moz-border-radius:60px;
  border-radius:60px;

  :hover {
    opacity: 1;
  }
`

const dialogOptions = {
  title: 'Feedback for OONI Explorer',
  subtitle: 'Our developers would love to know what you think.',
  // suppress the additional default subtitle
  subtitle2: '',
  labelComments: 'Share your feedback/experience',
  labelSubmit: 'Submit Feedback'
}

const FeedbackButton = () => (
  <StyledFeedbackButton onClick={() => {
    const eventId = Sentry.captureMessage('User Feedback')
    Sentry.showReportDialog({ eventId, ...dialogOptions })
  }
  } alignItems='center' justifyContent='center'>
    <MdFeedback size={24} color={theme.colors.white} />
  </StyledFeedbackButton>
)

export default FeedbackButton
