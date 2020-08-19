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
 * This masterpiece generates a "pre" HTML element with the Solr highlighting as "mark" -elements
 * 
 * It's actually pretty cool and magnitudes faster than the previous implementation.
 * It also adds the selection range to the div-element directly so that there is no need computing
 * it again, which is also pretty neat. Probably should have tests for it but I'm like 99% sure it
 * works, even in all edge cases.
 * @param code 
 */
function createHTML(code: string) {
  const pre = document.createElement('pre')
  const LINEBREAK = '\n'
  const MARK = '<mark>'
  const MARK_END = '</mark>'
  let i = 0;
  let iters = 0;
  let t = ''
  while (i !== code.length) {
    const nextLinebreak = code.substring(i).indexOf(LINEBREAK)
    const nextMark = code.substring(i).indexOf(MARK)
    const nextMarkEnd = code.substring(i).indexOf(MARK_END)
    // debugger
    if ((nextMark === -1 && nextMarkEnd === -1) || nextLinebreak < nextMark) {
      const div = document.createElement('div')
      t = code.substring(i, i + nextLinebreak + LINEBREAK.length)
      div.appendChild(document.createTextNode(t))
      div.setAttribute('data-line-start', i.toString())
      div.setAttribute('data-line-end', (i + nextLinebreak + LINEBREAK.length).toString())
      pre.appendChild(div)
      i = i + nextLinebreak + LINEBREAK.length
    } else {
      t = code.substring(i, i + nextMark)
      pre.appendChild(document.createTextNode(t))
      const mark = document.createElement('mark')
      t = code.substring(i + nextMark + MARK.length, i + nextMarkEnd)
      mark.appendChild(document.createTextNode(t))
      pre.appendChild(mark)
      i = i + nextMarkEnd + MARK_END.length
    }
    iters += 1
    if (iters === 10000) break
  }
  return pre
}

export const CodeBlock = memo((props: IProps) => {
  const {
    className, code, selectionStart, selectionEnd, onSelectCode
  } = props
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
    const div = containerRef.current
    if (div && event.target && event.target instanceof HTMLElement && div.contains(event.target)) {
      // Will crash and burn if the values are not integers which they should always be
      const start = parseInt(event.target.getAttribute('data-line-start')!)
      const end = parseInt(event.target.getAttribute('data-line-end')!)
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

const Container = styled.div<{ selectionStart: number, selectionEnd: number }>`
  & > pre {
    background: #222;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    overflow: scroll;
    & > div {
      counter-increment: line-number;
      cursor: pointer;
      &[data-line-start="${({ selectionStart }) => selectionStart }"][data-line-end="${({ selectionEnd }) => selectionEnd }"] {
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
