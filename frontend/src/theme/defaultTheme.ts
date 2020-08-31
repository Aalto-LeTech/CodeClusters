import { ITheme } from '../types/theme'

export const breakpoints = {
  LARGER_DISPLAY_WIDTH: '1600px',
  LARGE_DISPLAY_WIDTH: '1280px',
  DEFAULT_WIDTH: '980px',
  TABLET_WIDTH: '768px',
  MOBILE_WIDTH: '480px'
}

export const defaultTheme : ITheme = {
  color: {
    bg: '#e1f1ff',
    bgLight: '#f1f9ff',
    gray: {
      lightest: 'rgba(0, 0, 0, 0.08)',
      lighter: '#eee',
      light: '#ccc',
      base: '#aaa',
    },
    primary: '#17b2ff', //'#1d9eff',
    primaryDark: '#005a87', // Using https://material.io/resources/color/#!/?view.left=0&view.right=1&primary.color=1d9eff
    primaryLight: '#6fcfff',
    lightGreen: '#96FF9A', // #00dfff; // #a9d5ff // #00aaff // #7fd5ff
    green: '#00e676',
    blue: '#425EC2',
    red: '#ff5c77', // '#ff5d5d',
    orange: '#EF7F00',
    secondary: '#3f51b5',
    textLight: '#666',
    textDark: '#222',
    white: '#fff',
    yellow: 'yellow',
  },
  fontSize: {
    xsmall: '14px',
    small: '15px',
    medium: '16px',
    large: '24px',
    xlarge: '40px',
    largeIcon: '50px'
  },
  font: {
    header: '\'IBM Plex Mono\', monospace',
    text: '\'Raleway\', sans-serif',
  },
  transitions: {
    bezier: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  },
  breakpoints
}
