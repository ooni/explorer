import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Button, Flex, Text, theme, RadioButton, RadioGroup } from 'ooni-components'
import { GrClose } from 'react-icons/gr'
import useStateMachine from '@cassiozen/usestatemachine'
import SpinLoader from 'components/vendor/SpinLoader'
import { submitFeedback } from 'lib/api'
import LoginForm from 'components/login/LoginForm'
import styled from 'styled-components'

const StyledCloseIcon = styled(GrClose)`
position: absolute;
top: 16px;
right: 16px;
font-size: 16px;
cursor: pointer;
`

const StyledError = styled.small`
  color: ${props => props.theme.colors.red5};
`

const blockedValues = [
  { top: 'ok' },
  { top: 'down',
    sub: [
      { top: 'down.unreachable' },
      { top: 'down.misconfigured' },
    ]
  },
  { top: 'blocked',
    sub: [
      { 
        top: 'blocked.blockpage',
        sub: [
          'blocked.blockpage.http',
          'blocked.blockpage.dns',
          'blocked.blockpage.server_side',
          'blocked.blockpage.server_side.captcha'
        ]
      },
      { top: 'blocked.dns',
        sub: ['blocked.dns.inconsistent', 'blocked.dns.nxdomain']
      },
      { top: 'blocked.tcp' },
      { top: 'blocked.tls' }
    ]
  },
]

const radioLevels = ['firstLevelRadio', 'secondLevelRadio', 'thirdLevelRadio']

const FeedbackBox = ({user, measurement_uid, setShowModal, previousFeedback, mutateUserFeedback}) => {
  const intl = useIntl()
  const [error, setError] = useState(null)

  const redirectTo = typeof window !== 'undefined' && window.location.href
  
  const defaultValues = useMemo(() => {
    if (!previousFeedback) return {}
    const feedbackLevels = previousFeedback.split('.')
    return feedbackLevels.reduce((acc, current, i) => {
      return {...acc, ...{[radioLevels[i]]: feedbackLevels.slice(0, i+1).join('.')}}
    }, {})
  }, [previousFeedback])
  
  const { handleSubmit, control, watch, setValue, getValues } = useForm({defaultValues})

  const [state, send] = useStateMachine({
    initial: 'initial',
    states: {
      initial: {
        effect({ send, setContext, event, context }) {
          if (!user?.logged_in) send('LOGIN')
          if (!previousFeedback) send('FEEDBACK')
        },
        on: {
          LOGIN: 'login',
          FEEDBACK: 'feedback'
        },
      },
      login: {
        on: {
          LOGIN_SUCCESS: 'loginSuccess',
        }
      },
      loginSuccess: {},
      feedback: {
        on: {
          CANCEL: 'initial',
          SUBMIT: 'submit'
        },
        effect() {
          return () => setError(null)
        },
      },
      submit: {
        effect({ send, setContext, event, context }) {
          const { firstLevelRadio, secondLevelRadio, thirdLevelRadio } = getValues()
          const feedbackParams = {
            measurement_uid,
            status: thirdLevelRadio || secondLevelRadio || firstLevelRadio
          }
          submitFeedback(feedbackParams)
            .then(() => {
              mutateUserFeedback()
              send('SUCCESS')
            })
            .catch((response) => {
              setError(response?.message || 'unknown')
            }).finally(() => send('FEEDBACK'))
        },
        on: {
          SUCCESS: 'success',
          FEEDBACK: 'feedback'
        }
      },
      success: {},
    },
  })


  const initialLoadFirst = useRef(false)
  const initialLoadSecond = useRef(false)
  const firstLevelRadio = watch(radioLevels[0])
  const secondLevelRadio = watch(radioLevels[1])
 
  useEffect(() => {
    if (initialLoadFirst.current) return setValue(radioLevels[1], null)
    initialLoadFirst.current = true
  }, [firstLevelRadio])
  useEffect(() => {
    if (initialLoadSecond.current) return setValue(radioLevels[2], null)
    initialLoadSecond.current = true
  }, [secondLevelRadio])

  const submitEnabled = useMemo(() => !!firstLevelRadio, [firstLevelRadio])

  return (
    <>
      <Box
        p={3}
        bg='gray0'
        sx={{
          width: '320px',
          position: 'absolute',
          right: '60px',
          borderRadius: '6px',
          boxShadow: '2px 5px 10px 0px rgba(0, 0, 0, 0.3)',
          zIndex: 100,
          fontSize: 16
        }}
      >
        <StyledCloseIcon onClick={() => setShowModal(false)} />
        <>
          {state.value === 'initial' && 
            <>
              <Text fontSize={18} fontWeight='bold' mb={3}>
                <FormattedMessage id="Measurement.Feedback.ExistingFeedback" />
              </Text>
              <Text mb={4}>
                <FormattedMessage id={`Measurement.Feedback.${previousFeedback}`} defaultMessage="" />
              </Text>
              <Flex justifyContent='center'>
                <Button hollow onClick={() => send('FEEDBACK')}>
                    <FormattedMessage id="General.Edit" />
                  </Button>
              </Flex>
            </>
          }
          {state.value === 'login' && 
            <>
              <Text fontSize={18} fontWeight='bold' mb={3}>
              <FormattedMessage id='Measurement.Feedback.Login.Title'/>
            </Text>
              <Text><FormattedMessage id='Measurement.Feedback.Login.Description'/></Text>
              <LoginForm onLogin={() => {send('LOGIN_SUCCESS')}} redirectTo={redirectTo} />
            </>
          }
          {state.value === 'loginSuccess' && 
            <>
              <Text fontSize={18} fontWeight='bold' mb={3}>
                <FormattedMessage id="Measurement.Feedback.Login.Confirmation.Title" />
              </Text>
              <Text>
                <FormattedMessage id="Measurement.Feedback.Login.Confirmation.Text" />
              </Text>
              <Button mt={4} onClick={() => setShowModal(false)}>
                <FormattedMessage id="General.OK" />
              </Button>
            </>
          }
          {state.value === 'feedback' &&
            <form onSubmit={(e) => e.preventDefault()}>
              <Text fontSize={18} fontWeight='bold' mb={3}>
                <FormattedMessage id="Measurement.Feedback.Title" />
              </Text>
              <Controller
                control={control}
                name={radioLevels[0]}
                render={({field}) => (
                  <RadioGroup {...field}>
                    {blockedValues.map(({top, sub}) => (
                      <>
                        <RadioButton
                          mb={2}
                          label={intl.formatMessage({id: `Measurement.Feedback.${top}`})}
                          value={top}
                          key={top}
                        />
                        {sub && firstLevelRadio === top && (
                          <Controller
                            control={control}
                            name={radioLevels[1]}
                            render={({field}) => (
                              <RadioGroup {...field}>
                                {sub.map(({top, sub}) => (
                                  <>
                                    <RadioButton
                                      mb={2}
                                      ml='23px'
                                      label={intl.formatMessage({id: `Measurement.Feedback.${top}`})}
                                      value={top}
                                      key={top}
                                    />
                                    {sub && secondLevelRadio === top && (
                                      <Controller
                                        control={control}
                                        name={radioLevels[2]}
                                        render={({field}) => (
                                          <RadioGroup {...field}>
                                            {sub.map(subVal => (
                                              <RadioButton
                                                mb={2}
                                                ml='45px'
                                                label={intl.formatMessage({id: `Measurement.Feedback.${subVal}`})}
                                                value={subVal}
                                                key={subVal}
                                              />)
                                            )}
                                            </RadioGroup>
                                          )}
                                    />)}
                                  </>
                                ))}
                              </RadioGroup>
                            )}
                        />)}
                      </>
                    ))}
                  </RadioGroup>
                )}
              />
              <Text mb={3}>
                <FormattedMessage id="Measurement.Feedback.Description" />
              </Text>
              {error && 
                <StyledError>
                  <FormattedMessage id='Measurement.Feedback.Failure' />
                  <Text mb={3}>Error: {error}</Text>
                </StyledError>
              }
              <Button mr={2} disabled={!submitEnabled} onClick={() => send('SUBMIT')}>
                <FormattedMessage id='General.Submit' />
              </Button>
              <Button hollow onClick={() => setShowModal(false)}>
                <FormattedMessage id='General.Cancel' />
              </Button>
            </form>
          }
          {state.value === 'submit' && 
            <SpinLoader background={theme.colors.gray0} />
          }
          {state.value === 'success' && 
            <>
              <Text fontSize={18} fontWeight='bold' mb={3}><FormattedMessage id='Measurement.Feedback.Success.Title' /></Text>
              <Text mb={4}><FormattedMessage id='Measurement.Feedback.Success.Description' /></Text>
              <Flex justifyContent='center'>
              <Button type='button' onClick={() => setShowModal(false)}><FormattedMessage id='General.Close' /></Button>
              </Flex>
            </>
          }
        </>
      </Box>
    </>
  )
}

export default FeedbackBox