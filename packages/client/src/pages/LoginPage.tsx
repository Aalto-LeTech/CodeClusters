import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from '../theme/styled'
import { MdEmail, MdLock } from 'react-icons/md'

import { Button } from '../elements/Button'
import { Input } from '../elements/Input'

import { stores } from 'stores'
import { ILoginCredentials } from '../types/user'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    authStore: { isAuthenticated, login },
  } = stores
  const [defaultValues, setDefaultValues] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.pathname)
    }
  }, [isAuthenticated])

  async function handleSubmit(data: any) {
    const success = await login!(data)
    if (success) {
      navigate('/')
    }
  }
  const handleSetDefaultValues = (name: string) => () => {
    setDefaultValues({
      email: `${name}@asdf.fi`,
      password: 'asdfasdf',
    })
  }
  return (
    <div>
      <h1>Login</h1>
      <ShortcutButtonsContainer>
        <Button onClick={handleSetDefaultValues('admin')}>Admin login</Button>
        <Button onClick={handleSetDefaultValues('tikku')}>Teacher login</Button>
        <Button onClick={handleSetDefaultValues('morty')}>Student 1 login</Button>
        <Button onClick={handleSetDefaultValues('linus')}>Student 2 login</Button>
      </ShortcutButtonsContainer>
      <div>
        <LoginForm defaultValues={defaultValues} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

interface IFormProps {
  defaultValues: ILoginCredentials
  onSubmit: (formValues: ILoginCredentials) => void
}
function LoginForm(props: IFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const values = {
      email,
      password,
    } as ILoginCredentials
    onSubmit(values)
  }
  const { defaultValues, onSubmit } = props
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    setEmail(defaultValues.email)
    setPassword(defaultValues.password)
  }, [defaultValues])
  return (
    <Form onSubmit={handleSubmit}>
      <LoginField>
        <label htmlFor="email">Email</label>
        <Input
          required
          type="email"
          name="current-email"
          autocomplete="on"
          placeholder={'Email'}
          icon={<MdEmail size={24} />}
          iconPadding="38px"
          fullWidth
          value={email}
          onChange={(val) => setEmail(val)}
        />
      </LoginField>
      <LoginField>
        <label htmlFor="password">Password</label>
        <Input
          required
          type="password"
          name="current-password"
          autocomplete="on"
          placeholder="********"
          icon={<MdLock size={24} />}
          iconPadding="38px"
          fullWidth
          value={password}
          onChange={(val) => setPassword(val)}
        />
      </LoginField>
      <Button type="submit">Submit</Button>
    </Form>
  )
}

const ShortcutButtonsContainer = styled.div`
  display: flex;
  ${Button} {
    margin-right: 1rem;
  }
`
const Form = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px 150px 150px 150px;
  ${Button} {
    margin-top: 20px;
    max-width: 240px;
    width: 240px;
  }
`
const LoginField = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 240px;
`
