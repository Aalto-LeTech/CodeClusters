import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { SubmissionStore } from '../stores/SubmissionStore'
import { ISubmissionWithDate } from 'common'

interface IProps {
  className?: string
  submissionStore?: SubmissionStore,
  onSelect: (submission: ISubmissionWithDate) => void
}

const SelectSubmissionListEl = inject('submissionStore')(observer((props: IProps) => {
  const { className, submissionStore, onSelect } = props
  const [loading, setLoading] = useState(false)
  const [submissionId, setSubmissionId] = useState(-1)

  useEffect(() => {
    setLoading(true)
    submissionStore!.getSubmissions().then(() => {
      setLoading(false)
    })
  }, [submissionStore])
  function handleSelect(submission: ISubmissionWithDate) {
    setSubmissionId(submission.id)
    onSelect(submission)
  }
  return (
    <Container className={className}>
      { loading ? 'Loading' :
      <SubmissionsList>
        { submissionStore!.submissions.map((s: ISubmissionWithDate, i: number) =>
        <SubmissionsListItem key={i} onClick={() => handleSelect(s)} selected={s.id === submissionId}>
          <p>Student id: {s.student_id}</p>
          <p>{s.date.toISOString()}</p>
          <pre className="code">{s.code}</pre>
        </SubmissionsListItem>
        )}
      </SubmissionsList>
      }
    </Container>
  )
}))

const Container = styled.div`
  max-height: 500px;
  overflow-y: scroll;
`
const SubmissionsList = styled.ul`
`
const SubmissionsListItem = styled.li<{ selected: boolean }>`
  background: ${({ selected }) => selected ? 'red' : '#ededed'};
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  padding: 1rem;
  transition: background 0.25s;
  &:hover {
    background: red;
  }
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
`

export const SelectSubmissionList = styled(SelectSubmissionListEl)``
