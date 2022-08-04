import React, { forwardRef, useImperativeHandle, useState } from 'react'
import styled from '../../theme/styled'
import { useForm, useFieldArray } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '../../utils/forms'

import { Input } from '../../elements/Input'
import { MultiInput } from '../../elements/MultiInput'

import { IReviewFlowCreateFormParams } from '@codeclusters/types'

const validationSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(102400).required(),
  tags: Joi.array().items(Joi.string()).min(1).required(),
})

interface IProps {
  className?: string
}

const resolver = joiResolver(validationSchema)

const CreateReviewFlowFormEl = forwardRef((props: IProps, ref: any) => {
  const { className } = props
  const {
    register, errors, control, reset, setError, clearError, handleSubmit,
  } = useForm<IReviewFlowCreateFormParams>({
    validationResolver: resolver,
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
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
    }),
    reset,
  }), [])

  function addTag(item: string) {
    clearError('tags')
    append({ id: item, name: item })
  }
  function removeTag(item: string) {
    remove(fields.findIndex(t => t.name === item))
    if (fields.length <= 1) {
      setError('tags', 'min_length', 'not enough')
    }
  }

  return (
    <Form className={className}>
      <FormField>
        <label htmlFor="new_review_flow_title">Title</label>
        <Input
          fullWidth
          id="new_review_flow_title"
          name="title"
          placeholder="Title of the review flow"
          ref={register}/>
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
          placeholder="Description of what the flow does and why it's useful"
          ref={register}/>
        <Error>
          {errors.description && 'Description must be at least 1 character long.'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor="new_reviewflow_tags">Tags</label>
        <MultiInput
          fullWidth
          id="new_reviewflow_tags"
          placeholder="Press enter to input"
          value={tagText}
          items={fields.map(f => f.name)}
          onChange={(val: string) => setTagText(val)}
          onAddItem={addTag}
          onRemoveItem={removeTag}
        />
        { fields.map((f, i) =>
        <input
          key={`f_${f.id}_${i}`}
          type="hidden"
          name={`tags[${i}]`}
          defaultValue={f.name}
          ref={register()}
        />
        )}
        <Error>
          { errors.tags && 'You must have at least 1 tag.'}
        </Error>
      </FormField>
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

export const CreateReviewFlowForm = styled(CreateReviewFlowFormEl)``
