import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ClusteringsList } from '../components/ClusteringsList'
import { Button } from '../elements/Button'
import { Input } from '../elements/Input'

import { ClusteringStore } from '../stores/ClusteringStore'
import { IRunClusteringParams, IRunClusteringResponse } from 'shared'

interface IProps {
  clusteringStore: ClusteringStore,
}

export const ClusteringsPage = inject('clusteringStore')(observer((props: IProps) => {
  const { clusteringStore } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    clusteringStore.getClusterings().then(() => {
      setLoading(false)
    })
  }, [clusteringStore])
  function handleRunClustering(data: IRunClusteringParams) {
    return clusteringStore.runClustering(data)
  }
  return (
    <Container>
      <header>
        <h1>Clusterings</h1>
      </header>
      <RunClusteringForm onSubmit={handleRunClustering}/>
      { loading ? 'Loading' :
      <ClusteringsList clusterings={clusteringStore!.clusterings}/>
      }
    </Container>
  )
}))

interface IFormProps {
  className?: string
  onSubmit: (data: IRunClusteringParams) => Promise<IRunClusteringResponse | undefined>
}
const RunClusteringForm = styled((props: IFormProps) => {
  const { className } = props
  const [course, setCourse] = useState(1)
  const [exercise, setExercise] = useState(1)
  const [submitInProgress, setSubmitInProgress] = useState(false)

  function hasNoError() {
    return true
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      const payload = {
        course_id: course,
        exercise_id: exercise,
      }
      setSubmitInProgress(true)
      const result = await props.onSubmit(payload)
      if (result) {
        setSubmitInProgress(false)
      } else {
        setSubmitInProgress(false)
      }
    }
  }
  return (
    <Form onSubmit={handleSubmit} className={className}>
      <FormField>
        <label>Course</label>
        <Input
          type="number"
          value={course}
          onChange={(val: number) => setCourse(val)}
        ></Input>
      </FormField>
      <FormField>
        <label>Exercise</label>
        <Input
          type="number"
          value={exercise}
          onChange={(val: number) => setExercise(val)}
        ></Input>
      </FormField>
      <Button
        type="submit"
        intent="success"
        disabled={!hasNoError() || submitInProgress}
        loading={submitInProgress}
      >Submit</Button>
    </Form>
  )
})``

const Container = styled.div`
  & > ${RunClusteringForm} {
    margin-bottom: 1rem;
  }
`
const Form = styled.form`
  & > * {
    margin-top: 1rem;
  }
`
const FormField = styled.div`
  display: flex;
  flex-direction: column;
`
