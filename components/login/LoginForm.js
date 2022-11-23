import React, { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Flex, Box, Input, Button, Modal, Text, Heading, Container } from 'ooni-components'
import styled from 'styled-components'
import NLink from 'next/link'

import { registerUser } from '/lib/api'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import SpinLoader from 'components/vendor/SpinLoader'

const StyledError = styled.small`
  color: ${props => props.theme.colors.red5};
`

const StyledModal = styled(Modal).attrs({
  maxWidth: 800,
  width: '100%'
})``

const StyledInputContainer = styled(Box).attrs({
  // width: [1, 1 / 3],
  my: 3,
})`
  position: relative;
  & ${StyledError} {
    position: absolute;
    top: -10px;
    right: 0px;
  }
`

export const LoginModal = ({ isShowing, hide, onLogin, submitted, reqError }) => {
  const redirectTo = typeof window !== 'undefined' && window.location.href

  return (
    <StyledModal show={isShowing} onHideClick={hide}>
      <Container p={[0, 3]}>
        <Flex flexDirection='row' justifyContent='end' mb={4}>
          <a onClick={() => hide()}>X</a>
        </Flex>
        {!submitted &&
          <>
            <Text fontSize={1} mb={2} textAlign='center'><FormattedMessage id="Login.EnterEmail" /></Text>
            <LoginForm onLogin={onLogin} redirectTo={redirectTo} />
          </>
        }
        {submitted &&
          <>
            <Heading h={3} width={[1, 2 / 3]} textAlign='center' mx='auto'>
              <FormattedMessage id="Login.Submitted" />
            </Heading>
            <Flex flexDirection='row' justifyContent='center' my={4}>
              <Button mx={3} width={1 / 3} onClick={() => hide()}><FormattedMessage id="General.Close" /></Button>
            </Flex>
          </>
        }
        {reqError &&
          <Box width={[1, 1 / 3]} mx='auto' textAlign={'center'}>
            <Box mb={3} p={4} bg='red1'>{reqError}</Box>
            <NLink href='/login'><FormattedMessage id="Login.Failure" /></NLink>
          </Box>
        }
      </Container>
    </StyledModal>
  )
}
  

export const LoginForm = ({ onLogin, redirectTo }) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)

  const { handleSubmit, control, formState, reset } = useForm({
    mode: 'onTouched',
    defaultValues: { email_address: '' }
  })

  const { errors, isValid, isDirty } = formState

  const onSubmit = useCallback((data) => {
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
  }, [onLogin, reset, redirectTo])

  useEffect(() => {
    // Remove previous errors when form becomes dirty again
    if (isDirty) {
      setError(null)
    }
  }, [isDirty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        flexDirection={['column']}
        alignItems={'center'}
      >
        <StyledInputContainer>
           <Controller
            render={({field}) => (
              <Input 
                placeholder='Email *'
                {...field}
              />
            )}
            name='email_address'
            control={control}
          />
          <StyledError>{errors?.email_address?.message}</StyledError>
        </StyledInputContainer>
        {loginError && 
          <Box my={1}>
            <StyledError>{loginError}</StyledError>
          </Box>
        }
        {!submitting ? 
          <Box mt={2}>
            <Button type='submit'><FormattedMessage id="General.Login" /></Button>
          </Box> :
          <SpinLoader />}
      </Flex>
    </form>
  )
}

export default LoginForm
