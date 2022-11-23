import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Button, Flex, Link, Text, theme } from 'ooni-components'
import { RadioGroup, RadioButton } from 'components/search/Radio'
import useStateMachine from '@cassiozen/usestatemachine'
import SpinLoader from 'components/vendor/SpinLoader'
import { submitFeedback, getAPI } from 'lib/api'
import LoginForm from 'components/login/LoginForm'

const okValues = ['ok', 'ok.unreachable', 'ok.broken', 'ok.parked']
const blockedValues = [
  { top: 'ok' },
  { top: 'ok.broken' },
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

const QuestionText = ({i18nKey}) => (
  <Text fontSize={16} mb={3}><FormattedMessage id={i18nKey} /></Text>
)

const FeedbackBox = ({user, report_id, setShowModal, previousFeedback}) => {
  const intl = useIntl()
  const [error, setError] = useState(null)

  const redirectTo = typeof window !== 'undefined' && window.location.href
  

  const { handleSubmit, control, watch, setValue, getValues } = useForm()

  const [state, send] = useStateMachine({
    initial: 'initial',
    states: {
      initial: {
        effect({ send, setContext, event, context }) {
          if (!user.loggedIn) send('LOGIN')
          if (!previousFeedback) send('FEEDBACK')
        },
        on: {
          IS_BLOCKING: 'isBlocking',
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
        }
      },
      submit: {
        effect({ send, setContext, event, context }) {
          const { nested, feedback } = getValues()
          const feedbackParams = {
            measurement_uid: report_id,
            status: nested || feedback
          }
          submitFeedback(feedbackParams)
            .then(() => send('SUCCESS'))
            .catch(({response}) => {
              setError(response?.data?.error || 'unknown')
              send('FAILURE')
            })
        },
        on: {
          SUCCESS: 'success',
          FAILURE: 'failure'
        }
      },
      success: {},
      failure: {
        on: {
          SUBMIT: 'submit'
        },
        effect() {
          return () => setError(null)
        },
      }
    },
  })

  const firstLevel = watch('feedback')
  const nestedLevel = watch('nested')
  const lastLevel = watch('last')
 
  useEffect(() => {
    setValue('nested', null)
  }, [firstLevel, setValue])
  useEffect(() => {
    setValue('last', null)
  }, [nestedLevel, setValue])

  const submitEnabled = useMemo(() => !!firstLevel, [firstLevel])

  return (
    <>
        <Box
          p={3}
          bg='gray1'
          sx={{
            width: '293px',
            position: 'absolute',
            right: '60px',
            borderRadius: '6px',
          boxShadow: '2px 5px 10px 0px rgba(0, 0, 0, 0.3)',
          zIndex: 100
          }}
        >
          <>
            {state.value === 'initial' && 
              <>
                <Text fontSize={18} fontWeight='bold' mb={3}>
                  <FormattedMessage id="Measurement.Feedback.ExistingFeedback" />
                </Text>
                <Text fontSize={16} mb={4}>
                  <FormattedMessage id={`Measurement.Feedback.${previousFeedback}`} />
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
                <LoginForm onLogin={() => {console.log('send');send('LOGIN_SUCCESS')}} redirectTo={redirectTo} />
              </>
            }
            {state.value === 'feedback' &&
              <form onSubmit={(e) => e.preventDefault()}>
                <Text fontSize={18} fontWeight='bold' mb={3}>Verify the measurement</Text>
                <Controller
                  control={control}
                  name='feedback'
                  render={({field}) => (
                    <RadioGroup {...field}>
                      {blockedValues.map(({top, sub}) => (
                        <>
                        <RadioButton
                            label={intl.formatMessage({id: `Measurement.Feedback.${top}`})}
                            value={top}
                            key={top}
                      />
                          {sub && firstLevel === top && (
                <Controller
                  control={control}
                              name='nested'
                  render={({field}) => (
                    <RadioGroup {...field}>
                                  {sub.map(({top, sub}) => (
                        <>
                          <RadioButton
                                        ml='23px'
                            label={intl.formatMessage({id: `Measurement.Feedback.${top}`})}
                            value={top}
                            key={top}
                          />
                                      {sub && nestedLevel === top && (
                            <Controller
                              control={control}
                                          name='last'
                              render={({field}) => (
                                <RadioGroup {...field}>
                                  {sub.map(subVal => (
                                    <RadioButton
                                                  ml='45px'
                                      label={intl.formatMessage({id: `Measurement.Feedback.${subVal}`})}
                                      value={subVal}
                                      key={subVal}
                                    />
                                              ))}
                                            </RadioGroup>
                                          )}
                                        />)
                                      }
                                    </>
                                  ))}
                                </RadioGroup>
                              )}
                            />)
                          }
                        </>
                      ))}
                    </RadioGroup>
                  )}
                />
                <Button mr={2} disabled={!submitEnabled} onClick={() => send('SUBMIT')}>
                  <FormattedMessage id='General.Submit' />
                </Button>
              <Button hollow onClick={() => setShowModal(false)}>
                  <FormattedMessage id='General.Cancel' />
                </Button>
              </form>
            }
            {state.value === 'submit' && 
              <SpinLoader background={theme.colors.gray3} />
            }
            {state.value === 'loginSuccess' && 
              <>
                <Text fontSize={18} fontWeight='bold' mb={3}>
                  Login link sent
                </Text>
                <Text>Please check your email for a link to login to your account.</Text>
                <Button mt={4} onClick={() => setShowModal(false)}>
                  OK
                </Button>
              </>
            }
            {state.value === 'success' && 
              <>
                <Text fontSize={18} fontWeight='bold' mb={3}><FormattedMessage id='Measurement.Feedback.Success.Title' /></Text>
                <Text fontSize={16} mb={4}><FormattedMessage id='Measurement.Feedback.Success.Description' /></Text>
                <Flex justifyContent='center'>
                <Button type='button' onClick={() => setShowModal(false)}><FormattedMessage id='General.Close' /></Button>
                </Flex>
              </>
            }
            {state.value === 'failure' && 
              <>
                <Text fontSize={16} mb={3}><FormattedMessage id='Measurement.Feedback.Failure' /></Text>
                <Text fontSize={16} mb={3}>{error && <p>Error: {error}</p>}</Text>
                <Button type='button' onClick={() => send('SUBMIT')}><FormattedMessage id='General.Submit' /></Button>
              </>
            }
          </>
        </Box>
    </>
  )
}

export default FeedbackBox