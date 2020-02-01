import React from 'react'
import { NavLink } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { AuthStore } from '../stores/AuthStore'

import { RouteComponentProps } from 'react-router'
import { IUser } from 'shared'

interface IProps extends RouteComponentProps<{}> {
  className?: string
  authStore?: AuthStore,
}

export const NavBar = inject('authStore')(observer((props: IProps) => {
  function handleLogout(e : React.MouseEvent<HTMLElement>) {
    authStore!.logout()
    history.push('/')
  }
  const { className, authStore, history } = props
  const { user, isAuthenticated } = authStore!
  return (
    <NavContainer className={className}>
      <MainLinks>
        <NavLinks user={user}/>
      </MainLinks>
      { isAuthenticated ?
      <Link to="#" role="button" onClick={handleLogout}>Logout</Link> :
      <Link to="/login">Login</Link>
      }
    </NavContainer>
  )
}))

function NavLinks(props: { user?: IUser }) {
  const { user } = props
  if (!user) {
    return (
      <Link to="/">Frontpage</Link>
    )
  }
  if (user.role === 'STUDENT') {
    const reviewUrl = `/review/${user.student_id}`
    return (
      <>
        <Link to="/">Frontpage</Link>
        <Link to={reviewUrl}>My reviews</Link>
      </>
    )
  }
  return (
    <>
      <Link to="/">Frontpage</Link>
      <Link to="/reviews">Reviews</Link>
      <Link to="/review/create">Review</Link>
      <Link to="/clusterings">Clusterings</Link>
      <Link to="/submissions">Submissions</Link>
      <Link to="/submit">Submit</Link>
    </>
  )
}

const NavContainer = styled.nav`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 1rem;
`
const Link = styled(NavLink)`
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.textDark};
  box-sizing: border-box;
  color: ${({ theme }) => theme.color.textDark};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.medium};
  padding: 1rem;
  text-decoration: none;
  &:hover {
    background-color: ${({ theme }) => theme.color.primary};
    color: ${({ theme }) => theme.color.white};
  }
  transition: 0.2s all;
`
const MainLinks = styled.div`
  display: flex;
  ${Link} {
    margin-right: 1rem;
    &:last-child {
      margin-right: 0;
    }
  }
`
