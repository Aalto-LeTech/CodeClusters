export interface IThemeColor {
  gray: string
  grayLight: string
  green: string
  orange: string
  blue: string
  textLight: string
  textDark: string
  bg: string
  white: string
  primary: string
  primaryDark: string
  secondary: string
  red: string
  yellow: string
}

export type Intent = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'

export interface ITheme {
  color: IThemeColor
  font: {
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
}
