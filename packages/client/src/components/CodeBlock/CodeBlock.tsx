import React, { memo, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import styled from '../../theme/styled'

interface IProps {
  className?: string
  code: string
  selectionStart: number
  selectionEnd: number
  onSelectCode: (start: number, end: number) => void
}

/**
 * This masterpiece generates a "pre" HTML element with code lines as divs, and the Solr highlighting as "mark" -elements
 *
 * It's actually pretty cool and magnitudes faster than the previous implementation.
 * It also adds the selection range to the div-element directly so that there is no need computing
 * it again, which is also pretty neat. Probably should have tests for it but I'm like 99% sure I've fixed
 * most of the bugs.
 * @param code
 */
function createHTML(code: string) {
  const pre = document.createElement('pre')
  const LINEBREAK = '\n'
  const MARK = '<mark>'
  const MARK_END = '</mark>'
  let i = 0
  let iters = 0
  let text = ''
  let openDivBlock = null
  let openDivBlockStart = 0
  while (i !== code.length) {
    const nextLinebreak = code.substring(i).indexOf(LINEBREAK)
    const nextMark = code.substring(i).indexOf(MARK)
    const nextMarkEnd = code.substring(i).indexOf(MARK_END)
    // if (i > 600) debugger
    if ((nextMark === -1 && nextMarkEnd === -1) || nextLinebreak < nextMark) {
      let lineEnd = i + nextLinebreak + LINEBREAK.length
      // Special case if the code doesn't end with line break
      if (nextLinebreak === -1) {
        lineEnd = code.length
      }
      text = code.substring(i, lineEnd)
      if (openDivBlock !== null) {
        const textLength = text.length + (openDivBlock.textContent || '').length
        openDivBlock.setAttribute('data-line-end', (openDivBlockStart + textLength).toString())
        openDivBlock.appendChild(document.createTextNode(text))
        pre.appendChild(openDivBlock)
        openDivBlock = null
      } else {
        const div = document.createElement('div')
        div.appendChild(document.createTextNode(text))
        div.setAttribute('data-line-start', i.toString())
        div.setAttribute('data-line-end', lineEnd.toString())
        div.classList.add('data-line')
        pre.appendChild(div)
      }
      i = lineEnd
    } else {
      if (openDivBlock === null) {
        openDivBlock = document.createElement('div')
        openDivBlock.setAttribute('data-line-start', i.toString())
        openDivBlock.classList.add('data-line')
        openDivBlockStart = i
      }
      text = code.substring(i, i + nextMark)
      openDivBlock.appendChild(document.createTextNode(text))
      const mark = document.createElement('mark')
      text = code.substring(i + nextMark + MARK.length, i + nextMarkEnd)
      mark.appendChild(document.createTextNode(text))
      openDivBlock.appendChild(mark)
      i = i + nextMarkEnd + MARK_END.length
    }
    iters += 1
    if (iters === 10000) {
      throw Error('Possible infinite loop in CodeBlock, 10000 iterations run: ' + pre.textContent)
    }
  }
  return pre
}

export const CodeBlock = memo((props: IProps) => {
  const { className, code, selectionStart, selectionEnd, onSelectCode } = props
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    addHandlers()
    return () => {
      removeHandlers()
    }
  }, [containerRef])
  useLayoutEffect(() => {
    if (containerRef && containerRef.current) {
      const div = containerRef!.current!
      if (div.childNodes.length > 0) {
        div.removeChild(div.childNodes[0])
      }
      div.appendChild(createHTML(code))
    }
  }, [code])

  const handler = useCallback((event: MouseEvent | TouchEvent) => {
    const parentEl = containerRef.current
    const el = event.target
    if (parentEl && el && el instanceof HTMLElement && parentEl.contains(el)) {
      let lineDiv
      if (el.classList.contains('data-line')) {
        lineDiv = el
      } else if (el.nodeName === 'MARK') {
        lineDiv = el.parentElement!
      } else {
        return // Either pre or the container div
      }
      const start = parseInt(lineDiv.getAttribute('data-line-start')!)
      const end = parseInt(lineDiv.getAttribute('data-line-end')!)
      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw Error(`Non integers provided for data-line-start and end: ${start} ${end}`)
      }
      onSelectCode!(start, end)
    }
  }, [])
  function addHandlers() {
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
  }
  function removeHandlers() {
    document.removeEventListener('mousedown', handler)
    document.removeEventListener('touchstart', handler)
  }

  return (
    <Container
      className={className}
      ref={containerRef}
      selectionStart={selectionStart}
      selectionEnd={selectionEnd}
    />
  )
})

const Container = styled.div<{ selectionStart: number; selectionEnd: number }>`
  min-width: 100%;
  overflow: scroll;
  text-align: left;
  width: 100%;
  & > pre {
    background: #222;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    overflow: scroll;
    min-width: max-content;
    width: 100%;
    & > .data-line {
      counter-increment: line-number;
      cursor: pointer;
      min-width: fit-content;
      &[data-line-start='${({ selectionStart }) => selectionStart}'][data-line-end='${({
          selectionEnd,
        }) => selectionEnd}'] {
        background: #bb4949;
      }
      &:hover {
        background: #bb4949;
      }
      &::before {
        content: counter(line-number);
        display: inline-block;
        margin: auto 10px auto 0;
        min-width: 18px;
      }
    }
    & > mark {
      background: yellow;
    }
  }
`
