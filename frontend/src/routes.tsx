import * as React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute, NoMainContainerRoute } from './components/WrappedRoute'
import { AuthHOC } from './components/AuthHOC'

import { FrontPage } from './pages/FrontPage'
import { LoginPage } from './pages/LoginPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { ReviewViewPage } from './pages/ReviewViewPage'

export const Routes = () : React.ReactElement<any> => (
  <BrowserRouter>
    <Switch>
      <NoMainContainerRoute exact path="/" component={FrontPage}/>
      <WrappedRoute exact path="/login" component={LoginPage}/>
      <NoMainContainerRoute exact path="/reviews" component={AuthHOC(ReviewsPage)}/>
      <WrappedRoute exact path="/review/:userId" component={AuthHOC(ReviewViewPage)}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
