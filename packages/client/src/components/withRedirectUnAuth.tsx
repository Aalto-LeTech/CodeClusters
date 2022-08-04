import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { stores } from 'stores'

export const withRedirectUnAuth =
  (Component: (props: any) => React.ReactElement | JSX.Element) => (props: any) => {
    const {
      authStore: { isAuthenticated, logout },
    } = stores

    useEffect(() => {
      if (!isAuthenticated) {
        logout()
      }
    }, [isAuthenticated])

    if (!isAuthenticated) {
      ;<Navigate replace to="/" />
    }

    return <Component {...props} />
  }
