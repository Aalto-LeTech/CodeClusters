import * as React from 'react'
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'

import { DefaultLayout, NoContainerLayout } from './components/Layout'
import { withRedirectUnAuth } from './components/withRedirectUnAuth'

import { FrontPage } from './pages/FrontPage'
import { LoginPage } from './pages/LoginPage'
import { ManualPage } from './pages/ManualPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { ReviewViewPage } from './pages/ReviewViewPage'
import { SolrPage } from './pages/SolrPage'

const Reviews = withRedirectUnAuth(ReviewsPage)
const ReviewView = withRedirectUnAuth(ReviewViewPage)
const Solr = withRedirectUnAuth(SolrPage)

export const Routes = () => (
  <BrowserRouter>
    <RouterRoutes>
      <Route
        path="/"
        element={
          <NoContainerLayout>
            <FrontPage />
          </NoContainerLayout>
        }
      />
      <Route
        path="/login"
        element={
          <DefaultLayout>
            <LoginPage />
          </DefaultLayout>
        }
      />
      <Route path="/reviews" element={<NoContainerLayout>{<Reviews />}</NoContainerLayout>} />
      <Route path="/review/:userId" element={<DefaultLayout>{<ReviewView />}</DefaultLayout>} />
      <Route path="/manual" element={<NoContainerLayout>{<ManualPage />}</NoContainerLayout>} />
      <Route path="/solr" element={<DefaultLayout>{<Solr />}</DefaultLayout>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </RouterRoutes>
  </BrowserRouter>
)
