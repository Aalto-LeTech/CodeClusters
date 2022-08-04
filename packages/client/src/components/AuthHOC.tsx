import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'

import { Stores } from '../stores/Stores'

interface IProps {
  isAuthenticated?: boolean
  logout?: () => void
}

/**
 * Well it looked cool when I first made this...
 * Now I think it's a piece of shit. Opinions change. Too complicated & doesn't work => wasted hours.
 * @param WrappedComponent - Should be React.ComponentType<P> but I don't have time for this type-masturbation
 */
export function AuthHOC <P extends IProps>(WrappedComponent: React.ComponentType<any>) {
  class AuthHOCClass extends React.Component<IProps & RouteComponentProps<any>, {}> {
    render() {
      const { location, isAuthenticated, logout } = this.props
      if (!isAuthenticated) {
        logout!()
      }
      return isAuthenticated ?
        <WrappedComponent {...this.props as P & IProps & RouteComponentProps<any>} /> :
        <Redirect to={{ pathname: '/login', state: { from: location } }} />
    }
  }
  return inject((stores: Stores) => ({
    isAuthenticated: stores.authStore.isAuthenticated,
    logout: stores.authStore.logout,
  }))(AuthHOCClass)
}
