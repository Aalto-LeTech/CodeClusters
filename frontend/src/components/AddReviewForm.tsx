import React, { forwardRef, memo, useImperativeHandle, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { useForm } from 'react-hook-form'

import { Button } from '../elements/Button'
import { Input } from '../elements/Input'

import { IReviewCreateFormParams } from 'shared'

interface IProps {
  className?: string
  ref?: React.RefObject<HTMLFormElement>
  initialData?: IReviewCreateFormParams
  onUpdate?: (data: IReviewCreateFormParams) => void
  onSubmit?: (data: IReviewCreateFormParams, onSuccess: () => void, onError: () => void) => Promise<void>
  onCancel?: () => void
}

const AddReviewFormEl = memo(forwardRef((props: IProps, ref: any) => {
  const { className, initialData, onCancel, onSubmit } = props
  const { register, errors, reset, triggerValidation, getValues, handleSubmit } = useForm<IReviewCreateFormParams>({
    defaultValues: initialData
  })
  const [submitInProgress, setSubmitInProgress] = useState(false)

  // See NgramParametersForm.tsx for explanation
  useImperativeHandle(ref, () => ({
    executeSubmit: () => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject('AddReviewForm'), 500)
      handleSubmit((data: IReviewCreateFormParams, e?: React.BaseSyntheticEvent) => {
        clearTimeout(timeout)
        resolve(data)
      })()
    })
  }))

  const onSubmitForm = async (data: IReviewCreateFormParams, e?: React.BaseSyntheticEvent) => {
    setSubmitInProgress(true)
    onSubmit!(data, () => {
      setSubmitInProgress(false)
      reset()
    }, () => {
      setSubmitInProgress(false)
    })
  }
  return (
    <Form className={className} onSubmit={handleSubmit(onSubmitForm)}>
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
      { onSubmit && <Buttons>
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
      </Buttons>}
    </Form>
  )
}))

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
