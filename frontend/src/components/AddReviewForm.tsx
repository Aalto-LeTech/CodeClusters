import React, { memo, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { useForm } from 'react-hook-form'

import { Button } from '../elements/Button'
import { Input } from '../elements/Input'

interface IProps {
  className?: string
  initialData?: IAddReviewFormParams
  onUpdate?: (data: IAddReviewFormParams) => void
  onSubmit: (data: IAddReviewFormParams, onSuccess: () => void, onError: () => void) => Promise<void>
  onCancel?: () => void
}
export interface IAddReviewFormParams {
  message: string
  metadata: string
}

const AddReviewFormEl = memo((props: IProps) => {
  const { className, initialData, onUpdate, onCancel } = props
  const { register, errors, reset, handleSubmit } = useForm<IAddReviewFormParams>({
    defaultValues: initialData
  })
  const [submitInProgress, setSubmitInProgress] = useState(false)

  const onSubmit = async (data: IAddReviewFormParams, e?: React.BaseSyntheticEvent) => {
    setSubmitInProgress(true)
    props.onSubmit(data, () => {
      setSubmitInProgress(false)
      reset()
    }, () => {
      setSubmitInProgress(false)
    })
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FormField>
        <label htmlFor="message">Message</label>
        <Input
          fullWidth
          type="textarea"
          name="message"
          ref={register({
            required: true,
            minLength: 1
          })}/>
          <Error>
            {errors.message && 'Review requires message with at least 1 character.'}
          </Error>
      </FormField>
      <FormField>
        <label htmlFor="metadata">Metadata</label>
        <Input
          fullWidth
          type="textarea"
          name="metadata"
          ref={register}/>
      </FormField>
      <Buttons>
        <Button
          type="submit"
          intent="success"
          disabled={submitInProgress}
          loading={submitInProgress}
        >Submit</Button>
        <Button
          intent="transparent"
          onClick={onCancel}
        >Cancel</Button>
      </Buttons>
    </Form>
  )
})

const Form = styled.form`
  width: 100%;
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
`
const FormField = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`
const Error = styled.small`
  color: red;
`
const Buttons = styled.div`
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`

export const AddReviewForm = styled(AddReviewFormEl)``
