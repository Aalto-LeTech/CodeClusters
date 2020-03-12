import * as styledComponents from 'styled-components'

import { ITheme, Intent } from '../types/theme'

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<ITheme>

function getIntentColor(theme: ITheme, intent?: Intent) {
  switch (intent) {
    case 'secondary':
      return theme.color.secondary
    case 'success':
      return theme.color.green
    case 'danger':
      return theme.color.red
    case 'warning':
      return theme.color.yellow
    case 'transparent':
      return 'transparent'
    case 'primary':
    default:
      return theme.color.primary
  }
}
function getIntentTextColor(theme: ITheme, intent?: Intent) {
  switch (intent) {
    case 'secondary':
    case 'success':
    case 'danger':
    case 'warning':
    case 'transparent':
      return theme.color.textDark
    case 'primary':
    default:
      return theme.color.white
  }
}

export {
  css,
  createGlobalStyle,
  keyframes,
  getIntentColor,
  getIntentTextColor,
  ThemeProvider
}
export default styled
