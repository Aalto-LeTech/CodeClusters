import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { Button } from '../elements/Button'
import { Input } from '../elements/Input'

import { SubmissionStore } from '../stores/SubmissionStore'
import { ISubmission, ISubmissionCreateParams } from 'common'

interface IProps {
  submissionStore: SubmissionStore,
}

export const SubmitPage = inject('submissionStore')(observer((props: IProps) => {
  const { submissionStore } = props
  function handleSubmit(data: ISubmissionCreateParams) {
    return submissionStore.addSubmission(data)
  }
  return (
    <Container>
      <header>
        <h1>Submit</h1>
      </header>
      <SubmitForm onSubmit={handleSubmit}/>
    </Container>
  )
}))

interface IFormProps {
  className?: string
  onSubmit: (data: ISubmissionCreateParams) => Promise<ISubmission | undefined>
}
const SAMPLE_1 =
`#include <stdio.h>
int main() {
  printf('Hello There');
  return 0;
}
`

const SubmitForm = styled((props: IFormProps) => {
  const { className } = props
  const [exercise, setExercise] = useState(1)
  const [code, setCode] = useState('')
  const [submitInProgress, setSubmitInProgress] = useState(false)

  const handleSample = (sample: number) => () => {
    switch (sample) {
      case 1:
        setCode(SAMPLE_1)
    }
  }
  function hasNoError() {
    return true
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      const payload = {
        student_id: 1,
        course_id: 1,
        exercise_id: exercise,
        code,
      }
      setSubmitInProgress(true)
      const result = await props.onSubmit(payload)
      if (result) {
        setSubmitInProgress(false)
        setCode('')
      } else {
        setSubmitInProgress(false)
      }
    }
  }
  return (
    <Form onSubmit={handleSubmit} className={className}>
      <FormField>
        <label>Exercise</label>
        <Input
          type="number"
          value={exercise}
          onChange={(val: number) => setExercise(val)}
        ></Input>
      </FormField>
      <FormField>
        <label>Code</label>
        <Input
          type="textarea"
          value={code}
          onChange={(val: string) => setCode(val)}
          fullWidth
        ></Input>
      </FormField>
      <CodeSamples>
        <Button onClick={handleSample(1)} intent="secondary">Sample 1</Button>
      </CodeSamples>
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
const CodeSamples = styled.div``