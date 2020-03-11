import React, { memo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { FloatingReviewMenu } from '../FloatingReviewMenu'
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
  const [matches, setMatches] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [lineReviewMenuOpenTo, setLineReviewMenuOpenTo] = useState(-1)
  useEffect(() => {
    const hl = result.highlighted[0]
    setCodeLines(hl.split("\n"))
    setMatches((hl.match(/<mark>/g) || []).length)
  }, [result])
  function isReviewOpenOnLine(idx: number) {
    const openSubmission = reviewStore!.openSubmission
    const openSelection = reviewStore!.openSelection
    if (openSubmission && openSelection[0] !== 0) {
      return openSubmission.id === result.id && openSelection[0] === idx
    }
    return false
  }
  function handleLineClick(idx: number) {
    if (!isReviewOpenOnLine(idx)) {
      const selection = codeLines.reduce((acc, cur, i) => {
        if (i < idx) {
          acc[1] += cur.length + 2
        } else if (i === idx) {
          acc[2] = acc[0] + 2 +   cur.length
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
        <CodeLineWrapper key={`c-${i}`}>
        { isReviewOpenOnLine(i) &&
        <ReviewMenuWrapper>
           <FloatingReviewMenu />
        </ReviewMenuWrapper>}
        <CodeLine
          active={isReviewOpenOnLine(i)}
          dangerouslySetInnerHTML={{ __html: line }}
          onClick={() => handleLineClick(i)}
        />
        </CodeLineWrapper>
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
const ReviewMenuWrapper = styled.div`
  position: relative;
  & > ${FloatingReviewMenu} {
    left: -300px;
    position: absolute;
    top: 0;
    width: 288px;
  }
`
const CodeLineWrapper = styled.div``
const CodeLine = styled.div<{ active?: boolean }>`
  background: ${({ active, theme }) => active ? '#666' : '#222'};
  cursor: pointer;
  &:hover {
    background: #666;
  }
  & > mark {
    background: yellow;
  }
`
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
