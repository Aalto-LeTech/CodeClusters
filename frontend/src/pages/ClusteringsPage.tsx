import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ClusteringsList } from '../components/ClusteringsList'
import { Button } from '../elements/Button'
import { Input } from '../elements/Input'
import { MultiInput } from '../elements/MultiInput'

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
        <h1>Cluster</h1>
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
  const [course, setCourse] = useState(2)
  const [exercise, setExercise] = useState(1)
  const [filterText, setFilterText] = useState('')
  const [wordFilters, setWordFilters] = useState([] as string[])
  const [submitInProgress, setSubmitInProgress] = useState(false)

  function hasNoError() {
    return true
  }
  function handleFilterTextChange(val: string) {
    setFilterText(val)
  }
  function handleWordAdd(item: string) {
    setWordFilters([...wordFilters, item])
  }
  function handleWordRemove(item: string) {
    setWordFilters(wordFilters.filter(w => w !== item))
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      let filters = wordFilters
      if (filterText.length > 0) {
        filters = [...wordFilters, filterText]
        setWordFilters(filters)
        setFilterText('')
      }
      const payload = {
        course_id: course,
        exercise_id: exercise,
        word_filters: filters,
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
      <TopRow>
        <FormField>
          <label>Course</label>
          <Input
            fullWidth
            type="number"
            value={course}
            onChange={(val: number) => setCourse(val)}
          ></Input>
        </FormField>
        <FormField>
          <label>Exercise</label>
          <Input
            fullWidth
            type="number"
            value={exercise}
            onChange={(val: number) => setExercise(val)}
          ></Input>
        </FormField>
      </TopRow>
      <MiddleRow>
        <FormField>
          <label>Filters</label>
          <MultiInput
            type="text"
            fullWidth
            value={filterText}
            items={wordFilters}
            placeholder="Eg. while"
            onChange={handleFilterTextChange}
            onAddItem={handleWordAdd}
            onRemoveItem={handleWordRemove}
          ></MultiInput>
        </FormField>
      </MiddleRow>
      <div>pipeline select-option here, now only ngram</div>
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
  align-items: center;
  display: flex;
  flex-direction: column;
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
const TopRow = styled.div`
  display: flex;
  max-width: 400px;
  & > ${FormField} {
    width: 100%;
    &:first-child {
      margin-right: 1rem;
    }
  }
`
const MiddleRow = styled.div`
  display: flex;
  max-width: 400px;
  & > ${FormField} {
    width: 100%;
  }
`