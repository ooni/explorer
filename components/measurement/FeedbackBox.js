import React, { useEffect } from 'react'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Box, Button, Link } from 'ooni-components'
import { RadioGroup, RadioButton } from 'components/search/Radio'
import useStateMachine from '@cassiozen/usestatemachine'

const FeedbackBox = ({user, report_id, setShowModal}) => {
  const intl = useIntl()
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
      login: {},
      isBlocking: {
        effect({ send }) {
          if (!user.loggedIn) send('LOGIN')
        },
        on: {
          NOT_BLOCKING: 'notBlocking',
          BLOCKING: 'blocking',
          LOGIN: 'login'
        }
      },
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
          console.log('make submit request,', getValues())
          const values = getValues()
          const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL})
          client
            .post('/api/v1/measurement_feedback', {
              measurement_uid: report_id,
              status: values.nested ? values.nested : values.feedback
            })
            .then((data) => console.log('d', data))
            .catch((error) => console.log('e,',error))
        },
        on: {
          CLOSE: 'closed'
        }
      },
    },
  })

  const submit = (results) => {
    console.log('SUBMIT', results)
  }

  const firstLevel = watch('feedback')
  // console.log('firstLevel', firstLevel)
  useEffect(() => {
    setValue('nested', null)
  }, [firstLevel])

  useEffect(() => {
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL})
    client
      .get(`/api/v1/measurement_feedback/${report_id}`)
      .then((data) => console.log('d', data))
      .catch((error) => console.log('e,',error))
  }, [])

  return (
    <>
      {state.value !== 'closed' && 
        <Box
          p={3}
          sx={{
            border: '1px solid black',
            width: '400px',
            position: 'absolute',
            right: '60px',
            background: 'silver',
            borderRadius: '10px'
          }}
        >
          <form onSubmit={handleSubmit(submit)}>
            {state.value === 'initial' && (
              <>
                <p>Would you like to provide feedback on this measurement?</p>
                <Button onClick={() => send('IS_BLOCKING')}>Yes</Button>
                <Button onClick={() => send('CLOSE')}>No</Button>
              </>
            )}
            {state.value === 'login' && 
              <>Please <a onClick={() => setShowModal(true)}><Link>login</Link></a> to give feedback about the measurement</>
            }
            {state.value === 'isBlocking' && (
              <>
                <p>Is this a case of blocking?</p>
                <Button onClick={() => send('BLOCKING')}>Yes</Button>
                <Button onClick={() => send('NOT_BLOCKING')}>No</Button>
              </>
            )}
            {state.value === 'notBlocking' && (
              <>
                <p>What is the status of this service?</p>
                <Controller
                  control={control}
                  name='feedback'
                  render={({field}) => (
                    <RadioGroup {...field}>
                      <RadioButton
                        label={intl.formatMessage({id: 'Search.FilterButton.AllResults'}) }
                        value='ok'
                      />
                      <RadioButton
                        label='unreachable'
                        value='ok.unreachable'
                      />
                      <RadioButton
                        label='broken'
                        value='ok.broken'
                      />
                      <RadioButton
                        label='parked'
                        value='ok.parked'
                      />
                    </RadioGroup>
                  )}
                />
                <Button onClick={() => console.log('cancel')}>Cancel</Button>
                <Button onClick={() => send('SUBMIT')}>Submit</Button>
              </>
            )}
            {state.value === 'blocking' && (
              <>
                <p>What kind of blocking is it?</p>
                <Controller
                  control={control}
                  name='feedback'
                  render={({field}) => (
                    <RadioGroup {...field}>
                      <RadioButton
                        label='blocked'
                        value='blocked'
                      />
                      <RadioButton
                        label='blocked.blockpage'
                        value='blocked.blockpage'
                      />
                      {firstLevel === 'blocked.blockpage' && <Controller
                        control={control}
                        name='nested'
                        render={({field}) => (
                          <RadioGroup {...field}>
                            <RadioButton
                              label='blocked.blockpage.http'
                              value='blocked.blockpage.http'
                            />
                            <RadioButton
                              label='blocked.blockpage.dns'
                              value='blocked.blockpage.dns'
                            />
                            <RadioButton
                              label='blocked.blockpage.server_side'
                              value='blocked.blockpage.server_side'
                            />
                            <RadioButton
                              label='blocked.blockpage.server_side.captcha'
                              value='blocked.blockpage.server_side.captcha'
                            />
                          </RadioGroup>
                        )}
                      />}
                      <RadioButton
                        label='blocked.dns'
                        value='blocked.dns'
                      />
                      {firstLevel === 'blocked.dns' && <Controller
                        control={control}
                        name='nested'
                        render={({field}) => (
                          <RadioGroup {...field}>
                            <RadioButton
                              label='blocked.dns.inconsistent'
                              value='blocked.dns.inconsistent'
                            />
                            <RadioButton
                              label='blocked.dns.nxdomain'
                              value='blocked.dns.nxdomain'
                            />
                          </RadioGroup>
                        )}
                      />}
                    </RadioGroup>
                  )}
                />
                <Button type='button' onClick={() => send('BLOCKING')}>Cancel</Button>
                <Button type='button' onClick={() => send('SUBMIT')}>Submit</Button>
              </>
            )}
            {state.value === 'submit' && 
              <Button type='button' onClick={() => send('CLOSE')}>CLOSE</Button>
            }
          </form>
          {/* {!user.loggedIn ? <h2>Please <a onClick={() => setShowModal(true)}>login</a> to give feedback about the measurement</h2> : <h2>Leaveee feedback here</h2>} */}
        </Box>
      }
    </>
  )
}

export default FeedbackBox