import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { stores } from 'stores'

import { IUser } from '@codeclusters/types'

interface IProps {
  className?: string
}

export const NavBar = (props: IProps) => {
  const { className } = props
  const navigate = useNavigate()
  const {
    authStore,
  } = stores

  function handleLogout(e : React.MouseEvent<any>) {
    authStore!.logout()
    navigate('/')
  }
  const { user, isAuthenticated } = authStore
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
}

function NavLinks(props: { user?: IUser }) {
  const { user } = props
  if (!user) {
    return (
      <>
        <Link to="/" className="frontpage">CodeClusters</Link>
        <Link to="/manual">Manual</Link>
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
      <Link to="/solr">Solr</Link>
      <Link to="/manual">Manual</Link>
    </>
  )
}

const Container = styled.div`
  background: ${({ theme }) => theme.color.primaryDark};
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
  color: ${({ theme }) => theme.color.white};
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
    font-weight: 600;
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
