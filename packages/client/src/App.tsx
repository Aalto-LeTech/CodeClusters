import React, { useEffect } from 'react'
import { inject } from 'mobx-react'

import { Stores } from './stores'

interface IProps {
  className?: string
  isAuthenticated?: boolean
  children: React.ReactNode
  logout?: () => void
}

export const App = inject((stores: Stores) => ({
  isAuthenticated: stores.authStore.isAuthenticated,
  logout: stores.authStore.logout,
}))
((props: IProps) => {
  const { children, isAuthenticated, logout } = props
  useEffect(() => {
    if (!isAuthenticated) {
      logout!()
    }
  }, [])
  return <>{children}</>
})
