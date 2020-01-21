import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ReportStore } from '../stores/ReportStore'
import { IReportWithDate } from 'common'

interface IProps {
  reportStore: ReportStore,
}

export const ReportsPage = inject('reportStore')(observer((props: IProps) => {
  const { reportStore } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    reportStore.getReports().then(() => {
      setLoading(false)
    })
  }, [reportStore])
  return (
    <Container>
      <header>
        <h1>Reports</h1>
      </header>
      { loading ? 'Loading' :
      <ReportsList>
        { reportStore.reports.map((report: IReportWithDate, i: number) =>
        <ReportsListItem key={i}>
          <p>Course id: {report.course_id}</p>
          <p>Exercise id: {report.exercise_id}</p>
          <p>Student id: {report.student_id}</p>
          <p>{report.date.toISOString()}</p>
          <pre className="code">{report.code}</pre>
          <p className="message">{report.message}</p>
        </ReportsListItem>
        )}
      </ReportsList>
      }
    </Container>
  )
}))

const Container = styled.div`
`
const ReportsList = styled.ul`
`
const ReportsListItem = styled.li`
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
