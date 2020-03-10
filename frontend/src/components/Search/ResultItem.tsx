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
  useEffect(() => {
    // let lines = result.code[0].split("\n")
    const hl = result.highlighted[0].split("\n")
    setCodeLines(hl)
  }, [result])
  function handleResultClick(id: number) {

  }
  return (
    <Container className={className}>
      <p>Student id: {result.student_id}</p>
      <p>{result.date.toISOString()}</p>
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
  & > p {
    margin: 0 10px 0 0;
  }
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
const CodeLine = styled.div`
  & > mark {
    background: yellow;
  }
`

export const ResultItem = styled(ResultItemEl)``
