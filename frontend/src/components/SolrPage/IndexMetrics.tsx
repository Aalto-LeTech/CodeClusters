import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { SelectCourseExercise } from '../SelectCourseExercise'
import { Button } from '../../elements/Button'

import { IIndexMetricsParams } from 'shared'
import { Stores } from '../../stores'

interface IProps {
  className?: string
  courseId?: number
  exerciseId?: number
  indexMetrics?: (params: IIndexMetricsParams) => Promise<any>
}

const IndexMetricsEl = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  indexMetrics: stores.indexStore.indexMetrics,
}))
(observer((props: IProps) => {
  const { className, courseId, exerciseId, indexMetrics } = props
  const [loading, setLoading] = useState(false)
  function handleIndexMetrics() {
    setLoading(true)
    indexMetrics!({
      course_id: courseId!,
      exercise_id: exerciseId!,
    }).then(() => setLoading(false))
  }
  return (
    <Container className={className}>
      <Header>
        <h2>Run and index metrics</h2>
        <Info>
          <InfoText>
            Here you can run metrics on a given course and exercise to use them in search.
            <br />
          </InfoText>
        </Info>
      </Header>
      <SelectCourseExercise />
      <SolrControls>
        <Button loading={loading} onClick={handleIndexMetrics}>Run and index metrics</Button>
      </SolrControls>
    </Container>
  )
}))

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  > * + * {
    margin: 2rem 0;
  }
`
const Header = styled.header`
  display: flex;
  flex-direction: column;
`
const Info = styled.div`
  display: flex;
`
const InfoText = styled.p`
  margin: 0;
`
const SolrControls = styled.div`
  > * + * {
    margin: 1rem 0;
  }
`

export const IndexMetrics = styled(IndexMetricsEl)``
