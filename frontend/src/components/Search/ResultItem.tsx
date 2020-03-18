import React, { memo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { FloatingReviewMenu } from '../FloatingReviewMenu'
import { CodeLine } from './CodeLine'
import { Button } from '../../elements/Button'

import { ReviewStore } from '../../stores/ReviewStore'
import { ISearchParams, ISolrSubmissionWithDate } from 'shared'

interface IProps {
  className?: string
  result: ISolrSubmissionWithDate
  latestQuery: ISearchParams
  reviewStore?: ReviewStore
}

const ResultItemEl = inject('reviewStore')(observer((props: IProps) => {
  const { className, result, latestQuery, reviewStore } = props
  const [codeLines, setCodeLines] = useState([] as string[])
  const [rawCodeLines, setRawCodeLines] = useState([] as string[])
  const [matches, setMatches] = useState(0)

  useEffect(() => {
    const hl = result.highlighted[0]
    setCodeLines(hl.split("\n"))
    setRawCodeLines(hl.replace('<mark>', '').replace('</mark>', '').split("\n"))
    setMatches((hl.match(/<mark>/g) || []).length)
  }, [result])

  function isLineActive(idx: number) {
    if (reviewStore!.selected === result.id) {
      const selection = reviewStore!.getSelection(result.id)
      return selection !== undefined && selection.selection[0] === idx
    }
    return false
  }
  function isLineSelected(idx: number) {
    const selection = reviewStore!.getSelection(result.id)
    return reviewStore!.selected !== result.id && selection !== undefined && selection.selection[0] === idx
  }
  function handleLineClick(idx: number) {
    if (!isLineActive(idx)) {
      const selection = rawCodeLines.reduce((acc, cur, i) => {
        if (i < idx) {
          acc[1] += cur.length + 1
        } else if (i === idx) {
          acc[2] = acc[1] + 1 + cur.length
        }
        return acc
      }, [idx, 0, 0] as [number, number, number])
      reviewStore!.setOpenSubmission(result, selection)
    } else {
      reviewStore!.setOpenSubmission()
    }
  }
  return (
    <Container className={className}>
      <CodeHeader>
        <HeaderLeft>
          <div>Student id: {result.student_id}</div>
          <div>{result.date.toISOString()}</div>
        </HeaderLeft>
        <HeaderRight>
          <div>0 reviews</div>
          <div>{matches} matches</div>
        </HeaderRight>
      </CodeHeader>
      <pre className="code">
        {codeLines.map((line, i) =>
        <CodeLine key={`c-${i}`} code={line} active={isLineActive(i)} selected={isLineSelected(i)} index={i} onClick={handleLineClick}/>
        )}
      </pre>
      <Controls>
        <h3>Review</h3>
        <Buttons>
          <Button intent="success">Select</Button>
          <Button intent="danger">Discard</Button>
          <Button intent="info">Examine</Button>
        </Buttons>
      </Controls>
    </Container>
  )
}))

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #ededed;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  .code {
    background: #222;
    border-radius: 0.25rem;
    color: #fff;
    margin: 0;
    padding: 10px;
  }
  .message {
    background: rgba(255, 0, 0, 0.4);
    padding: 1rem;
    border-radius: 0.25rem;
  }
`
const CodeHeader = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`
const HeaderLeft = styled.div``
const HeaderRight = styled.div``
const Controls = styled.div`
  margin-top: 1rem;
  & > h3 {
    margin: 0 0 0.5rem 0;
  }
`
const Buttons = styled.div`
  display: flex;
  & > ${Button} {
    margin-right: 0.5rem;
  }
`

export const ResultItem = styled(ResultItemEl)``
