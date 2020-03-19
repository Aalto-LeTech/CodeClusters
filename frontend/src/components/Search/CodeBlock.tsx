import React, { memo } from 'react'
import styled from '../../theme/styled'

import { CodeLine } from './CodeLine'

interface IProps {
  className?: string
  codeLines: string[]
  showMenu: boolean
  activeSelection?: [number, number, number]
  onSelectCodeLine: (i: number) => void
}

export const CodeBlock = memo((props: IProps) => {
  const { className, codeLines, showMenu, activeSelection, onSelectCodeLine } = props
  function isLineActive(idx: number) {
    return showMenu && activeSelection !== undefined && activeSelection[0] === idx
  }
  function isLineSelected(idx: number) {
    return activeSelection !== undefined && activeSelection[0] === idx
  }
  return (
    <Container className={className}>
      {codeLines.map((line, i) =>
      <CodeLine
        key={`c-${i}`}
        lineNumber={i}
        code={line}
        showMenu={isLineActive(i)}
        selected={isLineSelected(i)}
        onClick={onSelectCodeLine}
      />
      )}
    </Container>
  )
}, (prevProps: IProps, nextProps: IProps) => {
  return prevProps.codeLines === nextProps.codeLines &&
    prevProps.showMenu === nextProps.showMenu &&
    prevProps.activeSelection === nextProps.activeSelection
})

const Container = styled.pre`
  background: #222;
  color: #fff;
  padding: 10px;
  border-radius: 0.25rem;
`
