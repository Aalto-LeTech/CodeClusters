import * as React from 'react'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'

import { WrappedRoute, NoMainContainerRoute } from './components/WrappedRoute'
import { AuthHOC } from './components/AuthHOC'

import { FrontPage } from './pages/FrontPage'
import { LoginPage } from './pages/LoginPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { ReviewCreatePage } from './pages/ReviewCreatePage'
import { ReviewViewPage } from './pages/ReviewViewPage'
import { SubmissionsPage } from './pages/SubmissionsPage'
import { SubmitPage } from './pages/SubmitPage'

export const Routes = () : React.ReactElement<any> => (
  <BrowserRouter>
    <Switch>
      <NoMainContainerRoute exact path="/" component={FrontPage}/>
      <WrappedRoute exact path="/login" component={LoginPage}/>
      <WrappedRoute exact path="/reviews" component={AuthHOC(ReviewsPage)}/>
      <NoMainContainerRoute exact path="/review/create" component={AuthHOC(ReviewCreatePage)}/>
      <WrappedRoute exact path="/review/:userId" component={AuthHOC(ReviewViewPage)}/>
      <WrappedRoute exact path="/submissions" component={AuthHOC(SubmissionsPage)}/>
      <WrappedRoute exact path="/submit" component={SubmitPage}/>
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
)
