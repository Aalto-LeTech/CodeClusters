import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { CodeBlock } from '../CodeBlock'
import { Button } from '../../elements/Button'

import { Stores } from '../../stores'
import { ISolrSubmissionWithDate, ISolrFullSubmissionWithDate } from 'shared'

type SolrSubmission = ISolrSubmissionWithDate | ISolrFullSubmissionWithDate

interface IProps {
  className?: string
  result: SolrSubmission
  selectedReviewId?: string
  selection?: [number, number]
  toggleSelection?(id: string, selection?: [number, number]) : void
}

function isFullSubmission(result: SolrSubmission): result is ISolrFullSubmissionWithDate {
  if ((result as ISolrFullSubmissionWithDate).code !== undefined) {
    return true
  }
  return false
}

const ResultItemEl = inject((stores: Stores, props: IProps) => ({
  selectedReviewId: stores.reviewStore.selectedId,
  selection: stores.reviewStore.selectedSubmissions[props.result.id]?.selection,
  toggleSelection: stores.reviewStore.toggleSelection,
}))
(observer((props: IProps) => {
  const { className, result, selection, toggleSelection } = props
  const [rawCode, setRawCode] = useState('')
  const [matches, setMatches] = useState(0)
  const isResultSelected = selection !== undefined
  const isNotBlankSelection = selection && (selection![0] !== 0 && selection![1] !== 0)

  useEffect(() => {
    if (isFullSubmission(result)) {
      const code = result.code[0]
      setRawCode(code)
      setMatches(0)
    } else {
      const hl = result.highlighted[0]
      setRawCode(hl)
      setMatches((hl.match(/<mark>/g) || []).length)
    }
  }, [result])

  function handleToggleSelection() {
    if (isResultSelected) {
      toggleSelection!(result.id)
    } else {
      toggleSelection!(result.id, [0, 0])
    }
  }
  function handleResetSelection() {
    toggleSelection!(result.id, [0, 0])
  }
  const handleCodeSelect = (start: number, end: number) => {
    toggleSelection!(result.id, [start, end])
  }
  return (
    <Container className={className} active={isResultSelected}>
      <CodeHeader>
        <HeaderLeft>
          <div>Student id: {result.student_id}</div>
          <div>{result.date.toISOString()}</div>
        </HeaderLeft>
        <HeaderRight>
          <Buttons>
            { isNotBlankSelection &&
            <Button intent="transparent" onClick={handleResetSelection}>
              Reset
            </Button>}
            <Button
              intent={isResultSelected ? 'primary' : 'success'}
              onClick={handleToggleSelection}
            >
              {isResultSelected ? 'Unselect' : 'Select'}
            </Button>
          </Buttons>
          <FlexCol>
            <div>0 reviews</div>
            <div>{matches} matches</div>
          </FlexCol>
        </HeaderRight>
      </CodeHeader>
      <CodeBlock
        code={rawCode}
        selectionStart={selection ? selection[0] : -1}
        selectionEnd={selection ? selection[1] : -1}
        onSelectCode={handleCodeSelect}
      />
    </Container>
  )
}))

const Container = styled.div<{ active: boolean }>`
  background: ${({ active, theme }) => active ? theme.color.red : '#fff'};
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin: 0 0 0.5rem 0;
  padding: 1rem;
  transition: ease-in background 0.2s;
`
const CodeHeader = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`
const HeaderLeft = styled.div``
const HeaderRight = styled.div`
  display: flex;
`
const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`
const Buttons = styled.div`
  display: flex;
  margin-right: 1rem;
  & > * + * {
    margin-left: 0.5rem;
  }
`

export const ResultItem = styled(ResultItemEl)``
