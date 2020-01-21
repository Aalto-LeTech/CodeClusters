import { ITheme } from '../types/theme'

export const defaultTheme : ITheme = {
  color: {
    bg: '#fff',
    gray: '#aaa',
    grayLight: '#eee',
    primary: '#1d9eff',
    primaryDark: '#0070cb', // Using https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=1d9eff
    green: '#00e676',
    blue: '#425EC2',
    red: '#ff5d5d',
    orange: '#EF7F00',
    secondary: '#6fcfff',
    textLight: '#666',
    textDark: '#222',
    white: '#fff',
    yellow: 'yellow',
  },
  fontSize: {
    small: '14px',
    medium: '16px',
    large: '24px',
    xlarge: '40px',
    largeIcon: '50px'
  },
  font: {
    text: '\'Raleway\', sans-serif',
  },
  transitions: {
    bezier: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  }
}
