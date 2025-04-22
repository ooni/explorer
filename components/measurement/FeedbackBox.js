import useStateMachine from '@cassiozen/usestatemachine'
import LoginForm from 'components/login/LoginForm'
import SpinLoader from 'components/vendor/SpinLoader'
import { submitFeedback } from 'lib/api'
import { RadioButton, RadioGroup, colors } from 'ooni-components'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { GrClose } from 'react-icons/gr'
import { FormattedMessage, useIntl } from 'react-intl'

const blockedValues = [
  { top: 'ok' },
  {
    top: 'down',
    sub: [{ top: 'down.unreachable' }, { top: 'down.misconfigured' }],
  },
  {
    top: 'blocked',
    sub: [
      {
        top: 'blocked.blockpage',
        sub: [
          'blocked.blockpage.http',
          'blocked.blockpage.dns',
          'blocked.blockpage.server_side',
          'blocked.blockpage.server_side.captcha',
        ],
      },
      {
        top: 'blocked.dns',
        sub: ['blocked.dns.inconsistent', 'blocked.dns.nxdomain'],
      },
      { top: 'blocked.tcp' },
      { top: 'blocked.tls' },
    ],
  },
]

const radioLevels = ['firstLevelRadio', 'secondLevelRadio', 'thirdLevelRadio']

const FeedbackBox = ({
  user,
  measurement_uid,
  setShowModal,
  previousFeedback,
  mutateUserFeedback,
}) => {
  const intl = useIntl()
  const [error, setError] = useState(null)

  const redirectTo = typeof window !== 'undefined' && window.location.href

  const defaultValues = useMemo(() => {
    if (!previousFeedback) return {}
    const feedbackLevels = previousFeedback.split('.')
    return feedbackLevels.reduce((acc, current, i) => {
      return {
        ...acc,
        ...{ [radioLevels[i]]: feedbackLevels.slice(0, i + 1).join('.') },
      }
    }, {})
  }, [previousFeedback])

  const { handleSubmit, control, watch, setValue, getValues } = useForm({
    defaultValues,
  })

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
          FEEDBACK: 'feedback',
        },
      },
      login: {
        on: {
          LOGIN_SUCCESS: 'loginSuccess',
        },
      },
      loginSuccess: {},
      feedback: {
        on: {
          CANCEL: 'initial',
          SUBMIT: 'submit',
        },
        effect() {
          return () => setError(null)
        },
      },
      submit: {
        effect({ send, setContext, event, context }) {
          const { firstLevelRadio, secondLevelRadio, thirdLevelRadio } =
            getValues()
          const feedbackParams = {
            measurement_uid,
            status: thirdLevelRadio || secondLevelRadio || firstLevelRadio,
          }
          submitFeedback(feedbackParams)
            .then(() => {
              mutateUserFeedback()
              send('SUCCESS')
            })
            .catch((response) => {
              setError(response?.message || 'unknown')
            })
            .finally(() => send('FEEDBACK'))
        },
        on: {
          SUCCESS: 'success',
          FEEDBACK: 'feedback',
        },
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
    <div className="p-4 bg-gray-50 absolute rounded-md w-[320px] right-[60px] top-[60px] shadow-[2px 5px 10px 0px rgba(0, 0, 0, 0.3)] z-[100]">
      <GrClose
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => setShowModal(false)}
      />
      <>
        {state.value === 'initial' && (
          <>
            <div className="text-lg font-bold mb-4">
              <FormattedMessage id="Measurement.Feedback.ExistingFeedback" />
            </div>
            <div className="mb-8">
              <FormattedMessage
                id={`Measurement.Feedback.${previousFeedback}`}
                defaultMessage=""
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="btn btn-primary-hollow"
                onClick={() => send('FEEDBACK')}
              >
                <FormattedMessage id="General.Edit" />
              </button>
            </div>
          </>
        )}
        {state.value === 'login' && (
          <>
            <div className="text-lg font-bold mb-4">
              <FormattedMessage id="Measurement.Feedback.Login.Title" />
            </div>
            <div>
              <FormattedMessage id="Measurement.Feedback.Login.Description" />
            </div>
            <LoginForm
              onLogin={() => {
                send('LOGIN_SUCCESS')
              }}
              redirectTo={redirectTo}
            />
          </>
        )}
        {state.value === 'loginSuccess' && (
          <>
            <div className="text-lg font-bold mb-4">
              <FormattedMessage id="Measurement.Feedback.Login.Confirmation.Title" />
            </div>
            <div>
              <FormattedMessage id="Measurement.Feedback.Login.Confirmation.Text" />
            </div>
            <button
              type="button"
              className="btn  btn-primary mt-8"
              onClick={() => setShowModal(false)}
            >
              <FormattedMessage id="General.OK" />
            </button>
          </>
        )}
        {state.value === 'feedback' && (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="text-lg font-bold mb-4">
              <FormattedMessage id="Measurement.Feedback.Title" />
            </div>
            <Controller
              control={control}
              name={radioLevels[0]}
              render={({ field }) => (
                <RadioGroup {...field}>
                  {blockedValues.map(({ top, sub }) => (
                    <>
                      <RadioButton
                        className="mb-2"
                        label={intl.formatMessage({
                          id: `Measurement.Feedback.${top}`,
                        })}
                        value={top}
                        key={top}
                      />
                      {sub && firstLevelRadio === top && (
                        <Controller
                          control={control}
                          name={radioLevels[1]}
                          render={({ field }) => (
                            <RadioGroup {...field}>
                              {sub.map(({ top, sub }) => (
                                <>
                                  <RadioButton
                                    className="mb-2 ml-6"
                                    label={intl.formatMessage({
                                      id: `Measurement.Feedback.${top}`,
                                    })}
                                    value={top}
                                    key={top}
                                  />
                                  {sub && secondLevelRadio === top && (
                                    <Controller
                                      control={control}
                                      name={radioLevels[2]}
                                      render={({ field }) => (
                                        <RadioGroup {...field}>
                                          {sub.map((subVal) => (
                                            <RadioButton
                                              className="mb-2 ml-11"
                                              label={intl.formatMessage({
                                                id: `Measurement.Feedback.${subVal}`,
                                              })}
                                              value={subVal}
                                              key={subVal}
                                            />
                                          ))}
                                        </RadioGroup>
                                      )}
                                    />
                                  )}
                                </>
                              ))}
                            </RadioGroup>
                          )}
                        />
                      )}
                    </>
                  ))}
                </RadioGroup>
              )}
            />
            <div className="mb-4">
              <FormattedMessage id="Measurement.Feedback.Description" />
            </div>
            {error && (
              <small className="text-red-500">
                <FormattedMessage id="Measurement.Feedback.Failure" />
                <div className="mb-4">Error: {error}</div>
              </small>
            )}
            <div className="flex">
              <button
                className="btn btn-primary mr-2"
                type="button"
                disabled={!submitEnabled}
                onClick={() => send('SUBMIT')}
              >
                <FormattedMessage id="General.Submit" />
              </button>
              <button
                className="btn btn-primary-hollow"
                type="button"
                onClick={() => setShowModal(false)}
              >
                <FormattedMessage id="General.Cancel" />
              </button>
            </div>
          </form>
        )}
        {state.value === 'submit' && <SpinLoader />}
        {state.value === 'success' && (
          <>
            <div className="text-lg font-bold mb-4">
              <FormattedMessage id="Measurement.Feedback.Success.Title" />
            </div>
            <div className="mb-8">
              <FormattedMessage id="Measurement.Feedback.Success.Description" />
            </div>
            <div className="flex justify-center">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setShowModal(false)}
              >
                <FormattedMessage id="General.Close" />
              </button>
            </div>
          </>
        )}
      </>
    </div>
  )
}

export default FeedbackBox
