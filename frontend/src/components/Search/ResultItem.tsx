import React, { memo, useMemo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { CodeBlock } from '../CodeBlock'
import { Button } from '../../elements/Button'

import { Stores } from '../../stores'
import { ReviewStore } from '../../stores/ReviewStore'
import { ISolrSubmissionWithDate, ISolrFullSubmissionWithDate } from 'shared'

type SolrSubmission = ISolrSubmissionWithDate | ISolrFullSubmissionWithDate

interface IProps {
  className?: string
  result: SolrSubmission
  selectedReviewId?: string
  getSelection?(id: string) : [number, number, number] | undefined
  toggleSelection?(id: string, selection?: [number, number, number]) : void
}

function isFullSubmission(result: SolrSubmission): result is ISolrFullSubmissionWithDate {
  if ((result as ISolrFullSubmissionWithDate).code !== undefined) {
    return true
  }
  return false
}

const ResultItemEl = inject((stores: Stores) => ({
  selectedReviewId: stores.reviewStore.selectedId,
  getSelection: stores.reviewStore.getSelection,
  toggleSelection: stores.reviewStore.toggleSelection,
}))
(observer((props: IProps) => {
  const { className, result, selectedReviewId, getSelection, toggleSelection } = props
  const [codeLines, setCodeLines] = useState([] as string[])
  const [rawCodeLines, setRawCodeLines] = useState([] as string[])
  const [matches, setMatches] = useState(0)
  const showMenuForThisReview = useMemo(() => selectedReviewId === result.id, [selectedReviewId])

  useEffect(() => {
    if (isFullSubmission(result)) {
      const code = result.code[0]
      setCodeLines(code.split("\n"))
      setRawCodeLines(code.split("\n"))
      setMatches(0)
    } else {
      const hl = result.highlighted[0]
      setCodeLines(hl.split("\n"))
      setRawCodeLines(hl.replace('<mark>', '').replace('</mark>', '').split("\n"))
      setMatches((hl.match(/<mark>/g) || []).length)
    }
  }, [result])

  function isResultSelected() {
    return getSelection!(result.id) !== undefined
  }
  function handleToggleSelection() {
    toggleSelection!(result.id)
  }
  function handleLineClick(idx: number) {
    const selection = rawCodeLines.reduce((acc, cur, i) => {
      if (i < idx) {
        acc[1] += cur.length + 1
      } else if (i === idx) {
        acc[2] = acc[1] + 1 + cur.length
      }
      return acc
    }, [idx, 0, 0] as [number, number, number])
    toggleSelection!(result.id, selection)
  }
  return (
    <Container className={className} active={isResultSelected()} onClick={handleToggleSelection}>
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
      <CodeBlock
        codeLines={codeLines}
        activeSelection={getSelection!(result.id)}
        showMenu={showMenuForThisReview}
        onSelectCodeLine={handleLineClick}
      />
      <Controls>
        <Buttons>
        </Buttons>
      </Controls>
    </Container>
  )
}))

const Container = styled.div<{ active: boolean }>`
  background: ${({ active, theme }) => active ? theme.color.red : '#fff'};
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  padding: 1rem;
  transition: ease-in background 0.2s;
  &:hover {
    background: ${({ active, theme }) => active ? theme.color.red : '#b7b7b7'};
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
