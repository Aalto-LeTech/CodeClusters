import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { SubmissionStore } from '../stores/SubmissionStore'
import { ISubmissionWithDate } from 'shared'

interface IProps {
  submissionStore: SubmissionStore,
}

export const SubmissionsPage = inject('submissionStore')(observer((props: IProps) => {
  const { submissionStore } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    submissionStore.getSubmissions().then(() => {
      setLoading(false)
    })
  }, [submissionStore])
  return (
    <Container>
      <header>
        <h1>Submissions</h1>
      </header>
      { loading ? 'Loading' :
      <SubmissionsList>
        { submissionStore.submissions.map((submission: ISubmissionWithDate, i: number) =>
        <SubmissionsListItem key={i}>
          <p>Course id: {submission.course_id}</p>
          <p>Exercise id: {submission.exercise_id}</p>
          <p>Student id: {submission.student_id}</p>
          <p>{submission.date.toISOString()}</p>
          <pre className="code">{submission.code}</pre>
        </SubmissionsListItem>
        )}
      </SubmissionsList>
      }
    </Container>
  )
}))

const Container = styled.div`
`
const SubmissionsList = styled.ul`
`
const SubmissionsListItem = styled.li`
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
`
