import React, { forwardRef, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized'

import { ISolrSubmissionWithDate, ISolrFullSubmissionWithDate } from '@codeclusters/types'

type SolrSubmission = ISolrSubmissionWithDate | ISolrFullSubmissionWithDate

interface IProps {
  className?: string
  submissions: ISolrFullSubmissionWithDate[]
  searched: number[]
}

interface ISubmissionRowProps extends ListRowProps {
  submission: SolrSubmission
  measureHeight: () => void
}

function isFullSubmission(result: SolrSubmission): result is ISolrFullSubmissionWithDate {
  if ((result as ISolrFullSubmissionWithDate).code !== undefined) {
    return true
  }
  return false
}

const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true,
})

// So after refactoring the CodeBlock component to be quite performant, this virtualized list version of the
// SearchResultsList isn't as necessary as before. However, with large enough lists it would be better to use it
// but before that can happen a teeny-weeny bug has to be fixed in it.
// As of 20.8.2020 the calculation of the dynamic heights of the rows doesn't work, and you can notice that by
// scrolling down a long list and somewhere in the middle it gets stuck in a loop where you have to scroll super
// fast to get to the bottom of the list.
// Somewhere in some tutorial somebody used this.listRef.resetHeights() or something to recalculate the heights
// when the data is changed but I have not tried it myself.
// https://blog.theodo.com/2018/09/use-react-virtualized/
const SubmissionRow = observer(
  forwardRef((props: ISubmissionRowProps, ref: any) => {
    const { index, style, submission, measureHeight } = props
    const [fullCode, setCode] = useState('')
    const [codeLines, setCodeLines] = useState<string[]>([])
    const [rawCodeLines, setRawCodeLines] = useState<string[]>([])
    const [matches, setMatches] = useState(0)

    useEffect(() => {
      measureHeight()
    }, [fullCode])
    useEffect(() => {
      if (isFullSubmission(submission)) {
        const code = submission.code[0]
        setCodeLines(code.split('\n'))
        setRawCodeLines(code.split('\n'))
        setMatches(0)
        setCode(code)
      } else {
        const hl = submission.highlighted[0]
        setCodeLines(hl.split('\n'))
        setRawCodeLines(hl.replace('<mark>', '').replace('</mark>', '').split('\n'))
        setMatches((hl.match(/<mark>/g) || []).length)
        setCode(hl)
      }
    }, [submission])

    return (
      <Row style={style} ref={ref}>
        <RowBody active={false}>
          <CodeHeader>
            <HeaderLeft>
              <div>Index: {index}</div>
              <div>Student id: {submission.student_id}</div>
              <div>{submission.date.toISOString()}</div>
            </HeaderLeft>
            <HeaderRight>
              <div>0 reviews</div>
              <div>{matches} matches</div>
            </HeaderRight>
          </CodeHeader>
          <CodeBody>
            <Code dangerouslySetInnerHTML={{ __html: fullCode }} />
          </CodeBody>
        </RowBody>
      </Row>
    )
  })
)

const Row = styled.div`
  padding-bottom: 1rem;
`
const RowBody = styled.div<{ active: boolean }>`
  background: ${({ active, theme }) => (active ? theme.color.red : '#fff')};
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  height: 100%;
  padding: 1rem;
`
const CodeHeader = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`
const HeaderLeft = styled.div``
const HeaderRight = styled.div``
const CodeBody = styled.div`
  background: #222;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
`
const Code = styled.div`
  background: #222;
  cursor: pointer;
  color: #fff;
  white-space: pre;
  &:hover {
    background: #bb4949;
  }
  & > mark {
    background: yellow;
  }
`

export const VirtualizedSearchResultsList = observer((props: IProps) => {
  const { submissions, searched } = props

  const rowRenderer = (props: ListRowProps) => {
    const { index, key, parent } = props
    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure, registerChild }) => (
          <SubmissionRow
            ref={registerChild}
            {...props}
            measureHeight={measure}
            submission={submissions[props.index]}
          />
        )}
      </CellMeasurer>
    )
  }
  const listProps = {
    rowHeight: 600,
    height: 600,
    rowRenderer,
    rowCount: submissions.length,
  }
  return (
    <Container>
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            {...listProps}
            width={width}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            id="list"
          />
        )}
      </AutoSizer>
    </Container>
  )
})

const Container = styled.div`
  flex: 1;
  #list {
    overflow-y: auto;
    overflow-x: hidden;
    &:focus {
      outline: none;
    }
    & > div {
      // Override react-virtualized to inherit the width from the parent to fit the columns on top of the scroll bar
      width: inherit !important;
    }
  }
`
