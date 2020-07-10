import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'

import { Stores } from './stores'
import { confMobx } from './stores/mobxConf'

import { defaultTheme } from './theme/defaultTheme'
import { GlobalStyle } from './theme/GlobalStyle'

import { App } from './App'
import { Routes } from './routes'
import { Toaster } from './components/Toaster'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  })
}

confMobx()

export const stores = new Stores()

render(
  <Provider {...stores}>
    <ThemeProvider theme={defaultTheme}>
      <App>
        <Routes />
        <Toaster />
        <GlobalStyle />
      </App>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
