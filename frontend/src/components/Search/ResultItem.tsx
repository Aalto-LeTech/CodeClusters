import React, { memo, useState, useEffect } from 'react'
import styled from '../../theme/styled'

import { Button } from '../../elements/Button'

import { ISearchParams, ISolrSubmissionWithDate } from 'shared'

interface IProps {
  className?: string
  result: ISolrSubmissionWithDate
  latestQuery: ISearchParams
}

const ResultItemEl = memo((props: IProps) => {
  const { className, result, latestQuery } = props
  const [codeLines, setCodeLines] = useState([] as string[])
  const [matches, setMatches] = useState(0)
  useEffect(() => {
    const hl = result.highlighted[0]
    setCodeLines(hl.split("\n"))
    setMatches((hl.match(/<mark>/g) || []).length)
  }, [result])
  function handleResultClick(id: number) {

  }
  return (
    <Container className={className}>
      <CodeHeader>
        <div>
          <div>Student id: {result.student_id}</div>
          <div>{result.date.toISOString()}</div>
        </div>
        <div>{matches} matches</div>
      </CodeHeader>
      <pre className="code">
        {codeLines.map((line, i) =>
        <CodeLine key={`c-${i}`} dangerouslySetInnerHTML={{ __html: line }}></CodeLine>  
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
})

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
const CodeLine = styled.div`
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
