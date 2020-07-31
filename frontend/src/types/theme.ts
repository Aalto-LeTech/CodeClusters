export interface IThemeColor {
  gray: {
    lightest: string
    lighter: string
    light: string
    base: string
  }
  lightGreen: string
  green: string
  orange: string
  blue: string
  textLight: string
  textDark: string
  bg: string
  bgLight: string
  white: string
  primary: string
  primaryDark: string
  primaryLight: string
  secondary: string
  red: string
  yellow: string
}

export interface IBreakpoints {
  LARGER_DISPLAY_WIDTH: string
  LARGE_DISPLAY_WIDTH: string
  DEFAULT_WIDTH: string
  TABLET_WIDTH: string
  MOBILE_WIDTH: string
}

export type Intent = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'transparent'

export interface ITheme {
  color: IThemeColor
  font: {
    header: string
    text: string
  }
  fontSize: {
    small: string
    large: string
    medium: string
    xlarge: string
    largeIcon: string
  }
  transitions: {
    bezier: string
  }
  breakpoints: IBreakpoints
}
