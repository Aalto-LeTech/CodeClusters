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
    <Container className={className}>
      <Nav>
        <MainLinks>
          <NavLinks user={user}/>
        </MainLinks>
        { isAuthenticated ?
        <Link to="#" role="button" onClick={handleLogout}>Logout</Link> :
        <Link to="/login">Login</Link>
        }
      </Nav>
    </Container>
  )
}))

function NavLinks(props: { user?: IUser }) {
  const { user } = props
  if (!user) {
    return (
      <>
        <Link to="/" className="frontpage">CodeClusters</Link>
      </>
    )
  }
  if (user.role === 'STUDENT') {
    const reviewUrl = `/review/${user.student_id}`
    return (
      <>
        <Link to="/" className="frontpage">CodeClusters</Link>
        <Link to={reviewUrl}>My reviews</Link>
      </>
    )
  }
  return (
    <>
      <Link to="/" className="frontpage">CodeClusters</Link>
      <Link to="/reviews">Reviews</Link>
    </>
  )
}

const Container = styled.div`
  background: ${({ theme }) => theme.color.primary};
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  padding: 1rem;
`
const Nav = styled.nav`
  align-items: center;
  display: flex;
  justify-content: space-between;
`
const Link = styled(NavLink)`
  box-sizing: border-box;
  color: ${({ theme }) => theme.color.textDark};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.medium};
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: 0.2s all;
  &:hover {
    text-decoration: underline;
  }
  &.frontpage {
    font-family: ${({ theme }) => theme.font.header};
  }
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
