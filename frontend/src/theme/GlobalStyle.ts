import { createGlobalStyle } from './styled'

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-family: 'Raleway',sans-serif;
    font-size: 16px;
  }
  body {
    margin: 0;
    padding: 0;
  }
  h1,h2,h3,h4 {
    font-family: ${({ theme }) => theme.font.text};
  }
  * {
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.font.text};
  }
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  a, a:visited {
  }
  html.scroll-lock {
    overflow: hidden;
  }
  [data-tooltip] {
    position: relative;
    &.left:before {
      left: -125%;
    }  
    &.top:before {
      top: -110%;
    }
    &.right:before {
      right: -125%;
    }
    &.bottom:before {
      bottom: -110%;
    }
  }
  [data-tooltip]:before {
    border-radius: 4px;
    box-shadow: 2px 2px 1px silver;
    color: #fff;
    content: attr(data-tooltip);
    opacity: 0;
    padding: 10px;
    position: absolute;
    transition: all 0.15s ease;
    width: max-content;
  }
  [data-tooltip]:hover:before {
    background: #222;
    opacity: 1;
  }
  [data-tooltip]:not([data-tooltip-persistent]):before {
    pointer-events: none;
  }
`
