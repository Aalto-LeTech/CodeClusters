import * as React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute } from './components/WrappedRoute'
import { AuthHOC } from './components/AuthHOC'

import { FrontPage } from './pages/FrontPage'
import { LoginPage } from './pages/LoginPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { ReviewPage } from './pages/ReviewPage'
import { SubmissionsPage } from './pages/SubmissionsPage'
import { SubmitPage } from './pages/SubmitPage'

export const Routes = () : React.ReactElement<any> => (
  <BrowserRouter>
    <Switch>
      <WrappedRoute exact path="/" component={FrontPage}/>
      <WrappedRoute exact path="/login" component={LoginPage}/>
      <WrappedRoute exact path="/reviews" component={AuthHOC(ReviewsPage)}/>
      <WrappedRoute exact path="/review" component={AuthHOC(ReviewPage)}/>
      <WrappedRoute exact path="/submissions" component={AuthHOC(SubmissionsPage)}/>
      <WrappedRoute exact path="/submit" component={SubmitPage}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
