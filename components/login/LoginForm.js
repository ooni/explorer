import { Input } from 'ooni-components'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import SpinLoader from 'components/vendor/SpinLoader'
import { FormattedMessage } from 'react-intl'
import { registerUser } from '/lib/api'

export const LoginForm = ({ onLogin, redirectTo }) => {
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)

  const { handleSubmit, control, formState, reset } = useForm({
    mode: 'onTouched',
    defaultValues: { email_address: '' },
  })

  const { errors, isValid, isDirty } = formState

  const onSubmit = useCallback(
    (data) => {
      const { email_address } = data
      const registerApi = async (email_address) => {
        try {
          await registerUser(email_address, redirectTo)
          if (typeof onLogin === 'function') {
            onLogin()
          }
        } catch (e) {
          setError(e.message)
          // Reset form to mark `isDirty` as false
          reset({}, { keepValues: true })
        } finally {
          setSubmitting(false)
        }
      }
      setSubmitting(true)
      registerApi(email_address)
    },
    [onLogin, reset, redirectTo],
  )

  useEffect(() => {
    // Remove previous errors when form becomes dirty again
    if (isDirty) {
      setError(null)
    }
  }, [isDirty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <div className="w-full mt-4 relative">
          <Controller
            render={({ field }) => (
              <Input
                placeholder="Email *"
                {...field}
                error={errors?.email_address?.message}
              />
            )}
            rules={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              },
              required: true,
            }}
            name="email_address"
            control={control}
          />
        </div>
        {loginError && (
          <div className="mt-1">
            <small className="text-red-500">{loginError}</small>
          </div>
        )}
        <div className="mt-4 self-center">
          {!submitting ? (
            <button
              className="btn btn-primary"
              disabled={!isValid}
              type="submit"
            >
              <FormattedMessage id="General.Login" />
            </button>
          ) : (
            <SpinLoader />
          )}
        </div>
      </div>
    </form>
  )
}

export default LoginForm
