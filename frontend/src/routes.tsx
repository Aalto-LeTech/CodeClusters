import * as React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute } from './components/WrappedRoute'
import { AuthHOC } from './components/AuthHOC'

import { FrontPage } from './pages/FrontPage'
import { LoginPage } from './pages/LoginPage'
import { ReportsPage } from './pages/ReportsPage'
import { SubmissionsPage } from './pages/SubmissionsPage'
import { SubmitPage } from './pages/SubmitPage'

export const Routes = () : React.ReactElement<any> => (
  <BrowserRouter>
    <Switch>
      <WrappedRoute exact path="/" component={FrontPage}/>
      <WrappedRoute exact path="/login" component={LoginPage}/>
      <WrappedRoute exact path="/reports" component={AuthHOC(ReportsPage)}/>
      <WrappedRoute exact path="/submissions" component={AuthHOC(SubmissionsPage)}/>
      <WrappedRoute exact path="/submit" component={SubmitPage}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
