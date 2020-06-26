import React, { forwardRef, memo, useImperativeHandle, useState } from 'react'
import styled from '../../theme/styled'
import { useForm, useFieldArray } from 'react-hook-form'

import { Input } from '../../elements/Input'
import { MultiInput } from '../../elements/MultiInput'

import { IReviewFlowCreateFormParams } from 'shared'

interface IProps {
  className?: string
}

const CreateReviewFlowFormEl = memo(forwardRef((props: IProps, ref: any) => {
  const { className } = props
  const { register, errors, control, handleSubmit } = useForm<IReviewFlowCreateFormParams>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags"
  })
  const [tagText, setTagText] = useState('')

  // See NgramParametersForm.tsx for explanation
  useImperativeHandle(ref, () => ({
    executeSubmit: () => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject('CreateReviewFlowForm'), 500)
      handleSubmit((data: IReviewFlowCreateFormParams, e?: React.BaseSyntheticEvent) => {
        clearTimeout(timeout)
        resolve(data)
      })()
    })
  }))

  const onSubmitForm = async (data: IReviewFlowCreateFormParams, e?: React.BaseSyntheticEvent) => {
  }
  return (
    <Form className={className} onSubmit={handleSubmit(onSubmitForm)}>
      <FormField>
        <label htmlFor="new_review_flow_title">Title</label>
        <Input
          fullWidth
          id="new_review_flow_title"
          name="title"
          ref={register({
            required: true,
            minLength: 1
          })}/>
        <Error>
          {errors.title && 'Title must be at least 1 character long.'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor="new_review_flow_description">Description</label>
        <Input
          fullWidth
          type="textarea"
          id="new_review_flow_description"
          name="description"
          ref={register({
            required: true,
            minLength: 1
          })}/>
        <Error>
          {errors.description && 'Description must be at least 1 character long.'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor="new_reviewflow_tags">Tags</label>
        <MultiInput
          fullWidth
          name="tags"
          id="new_reviewflow_tags"
          placeholder="Press enter to input"
          value={tagText}
          items={fields.map(f => f.name)}
          onChange={(val: string) => setTagText(val)}
          onAddItem={(item: string) => append({ id: item, name: item })}
          onRemoveItem={(item: string) => remove(fields.findIndex(f => f.name === item))}
        />
        <Error>
          {errors.tags && 'You must have at least 1 tag.'}
        </Error>
        {fields.map((item, index) => (
        <input
          key={`${index}_${item.id}`}
          type="hidden"
          name={`tags[${index}]`}
          defaultValue={item.name}
          ref={register()}
        />
        ))}
      </FormField>
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

export const CreateReviewFlowForm = styled(CreateReviewFlowFormEl)``
