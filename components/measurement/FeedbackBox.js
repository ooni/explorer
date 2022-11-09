import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Button, Link, Text, theme } from 'ooni-components'
import { RadioGroup, RadioButton } from 'components/search/Radio'
import useStateMachine from '@cassiozen/usestatemachine'
import SpinLoader from 'components/vendor/SpinLoader'
import { submitFeedback, getAPI } from 'lib/api'

const okValues = ['ok', 'ok.unreachable', 'ok.broken', 'ok.parked']
const blockedValues = [
  { top: 'blocked' },
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
  }
]

const QuestionText = ({i18nKey}) => (
  <Text fontSize={16} mb={3}><FormattedMessage id={i18nKey} /></Text>
)

const FeedbackBox = ({user, report_id, setShowModal, previousFeedback}) => {
  const intl = useIntl()
  const [error, setError] = useState(null)

  const { handleSubmit, control, watch, setValue, getValues } = useForm()

  const [state, send] = useStateMachine({
    initial: 'initial',
    states: {
      initial: {
        on: { 
          CLOSE: 'closed',
          IS_BLOCKING: 'isBlocking'
        },
      },
      isBlocking: {
        effect({ send, setContext, event, context }) {
          if (!user.loggedIn) send('LOGIN')
        },
        on: {
          NOT_BLOCKING: 'notBlocking',
          BLOCKING: 'blocking',
          LOGIN: 'login'
        }
      },
      login: {},
      blocking: {
        on: {
          CANCEL: 'initial',
          SUBMIT: 'submit'
        }
      },
      notBlocking: {
        on: {
          CANCEL: 'initial',
          SUBMIT: 'submit'
        }
      },
      closed: {},
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
      success: {
        on: {
          CLOSE: 'closed'
        }
      },
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
 
  useEffect(() => {
    setValue('nested', null)
  }, [firstLevel, setValue])

  const sumitEnabled = useMemo(() => firstLevel || nestedLevel, [firstLevel, nestedLevel])

  return (
    <>
      {state.value !== 'closed' && 
        <Box
          p={4}
          bg='gray1'
          sx={{
            width: '400px',
            position: 'absolute',
            right: '60px',
            borderRadius: '6px',
            boxShadow: '2px 5px 10px 0px rgba(0, 0, 0, 0.3)'
          }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            {state.value === 'initial' && 
              <>
                {previousFeedback ? 
                  <>
                    <Text fontSize={16} mb={3}><FormattedMessage id="Measurement.Feedback.ExistingFeedback" /></Text>
                    <Text fontSize={16} mb={3}><FormattedMessage id={`Measurement.Feedback.${previousFeedback}`} /></Text>
                    <Button mr={2} onClick={() => send('IS_BLOCKING')}>
                      <FormattedMessage id="General.Edit" />
                    </Button>
                  </> :
                  <>
                    <QuestionText i18nKey='Measurement.Feedback.Q1' />
                    <Button mr={2} onClick={() => send('IS_BLOCKING')}><FormattedMessage id='General.Yes' /></Button>
                    <Button onClick={() => send('CLOSE')}><FormattedMessage id='General.No' /></Button>
                  </>
                }
              </>
            }
            {state.value === 'login' && 
              <Text fontSize={16}>
                <FormattedMessage
                  id='Measurement.Feedback.Login'
                  values={{
                    'login': (string) => (<Link onClick={() => setShowModal(true)}>{string}</Link>)
                  }}
                />
              </Text>
            }
            {state.value === 'isBlocking' && (
              <>
                <QuestionText i18nKey='Measurement.Feedback.Q2' />
                <Button mr={2} onClick={() => send('BLOCKING')}><FormattedMessage id='General.Yes' /></Button>
                <Button onClick={() => send('NOT_BLOCKING')}><FormattedMessage id='General.No' /></Button>
              </>
            )}
            {state.value === 'notBlocking' && (
              <>
                <QuestionText i18nKey='Measurement.Feedback.Q3' />
                <Controller
                  control={control}
                  name='feedback'
                  render={({field}) => (
                    <RadioGroup {...field}>
                      {okValues.map(val => (
                        <RadioButton
                        label={intl.formatMessage({id: `Measurement.Feedback.${val}`})}
                        value={val}
                        key={val}
                      />
                      ))}
                    </RadioGroup>
                  )}
                />
                <Button mr={2} disabled={!sumitEnabled} onClick={() => send('SUBMIT')}><FormattedMessage id='General.Submit' /></Button>
                <Button hollow onClick={() => send('CANCEL')}><FormattedMessage id='General.Cancel' /></Button>
              </>
            )}
            {state.value === 'blocking' && (
              <>
                <QuestionText i18nKey='Measurement.Feedback.Q4' />
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
                                  {sub.map(subVal => (
                                    <RadioButton
                                      ml={3}
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
                />
                <Button type='button' mr={2} disabled={!sumitEnabled} onClick={() => send('SUBMIT')}>
                  <FormattedMessage id='General.Submit' />
                </Button>
                <Button type='button' hollow onClick={() => send('CANCEL')}>
                  <FormattedMessage id='General.Cancel' />
                </Button>
              </>
            )}
            {state.value === 'submit' && 
              <SpinLoader background={theme.colors.gray3} />
            }
            {state.value === 'success' && 
              <>
                <Text fontSize={16} mb={3}><FormattedMessage id='Measurement.Feedback.Success' /></Text>
                <Button type='button' onClick={() => send('CLOSE')}><FormattedMessage id='General.Close' /></Button>
              </>
            }
            {state.value === 'failure' && 
              <>
                <Text fontSize={16} mb={3}><FormattedMessage id='Measurement.Feedback.Failure' /></Text>
                <Text fontSize={16} mb={3}>{error && <p>Error: {error}</p>}</Text>
                <Button type='button' onClick={() => send('SUBMIT')}><FormattedMessage id='General.Submit' /></Button>
              </>
            }
          </form>
        </Box>
      }
    </>
  )
}

export default FeedbackBox