import React, { memo, useState, useEffect } from 'react'
import styled from '../../theme/styled'

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
      <div className="controls">
      </div>
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
  margin: 0 0 10px 0;
  padding: 1rem;
  .code {
    background: #222;
    color: #fff;
    padding: 10px;
    border-radius: 0.25rem;
  }
  .message {
    background: rgba(255, 0, 0, 0.4);
    padding: 1rem;
    border-radius: 0.25rem;
  }
  .controls {
    margin-top: 1rem;
  }
`
const CodeHeader = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
`
const CodeLine = styled.div`
  & > mark {
    background: yellow;
  }
`

export const ResultItem = styled(ResultItemEl)``
