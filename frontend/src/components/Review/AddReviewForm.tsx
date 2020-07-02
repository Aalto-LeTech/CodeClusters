import React, { forwardRef, memo, useImperativeHandle, useState } from 'react'
import styled from '../../theme/styled'
import { useForm, useFieldArray } from 'react-hook-form'
import Joi from '@hapi/joi'
import { joiResolver } from '../../utils/forms'

import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { MultiInput } from '../../elements/MultiInput'

import { IReview, IReviewCreateFormParams } from 'shared'

const validationSchema = Joi.object({
  message: Joi.string().min(1).max(10240).required(),
  metadata: Joi.string().allow('').max(10240).required(),
  tags: Joi.array().items(Joi.string()),
})

interface IProps {
  className?: string
  id: string
  ref?: React.RefObject<HTMLFormElement>
  initialData?: Partial<IReview>
  onUpdate?: (data: IReviewCreateFormParams) => void
  onSubmit?: (data: IReviewCreateFormParams, onSuccess: () => void, onError: () => void) => Promise<void>
  onCancel?: () => void
}

const resolver = joiResolver(validationSchema)

const AddReviewFormEl = memo(forwardRef((props: IProps, ref: any) => {
  const { className, id, initialData, onCancel, onSubmit } = props
  const { register, control, errors, reset, handleSubmit } = useForm<IReviewCreateFormParams>({
    validationResolver: resolver,
    defaultValues: {
      message: initialData?.message,
      metadata: initialData?.metadata,
      tags: initialData?.tags,
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const [tagsText, setTagsText] = useState('')

  // See NgramParametersForm.tsx for explanation
  useImperativeHandle(ref, () => ({
    executeSubmit: (defaultData?: IReviewCreateFormParams) => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject('AddReviewForm'), 500)
      handleSubmit((data: IReviewCreateFormParams, e?: React.BaseSyntheticEvent) => {
        if (defaultData) {
          resetValues(defaultData)
        }
        clearTimeout(timeout)
        resolve({ ...data, tags: fields.length === 0 ? [] : data.tags })
      })()
    }),
    reset: (params: any) => {
      if (params) resetValues(params)
      else reset({})
    },
  }), [])

  function handleTagsTextChange(text: string) {
    setTagsText(text)
  }
  function addTag(item: string) {
    append({ id: item, name: item })
  }
  function removeTag(item: string) {
    remove(fields.findIndex(f => f.name === item))
  }
  function resetValues(data: IReviewCreateFormParams) {
    const values = Object.keys(data).reduce((acc: any, k: string) => {
      const val = data[k]
      if (k === 'tags') {
        acc[k] = val.map((f: string) => ({ name: f }))
      } else {
        acc[k] = val
      }
      return acc
    }, {})
    reset(values)
  }
  const onSubmitForm = async (data: IReviewCreateFormParams, e?: React.BaseSyntheticEvent) => {
    setSubmitInProgress(true)
    onSubmit!({ ...data, tags: fields.length === 0 ? [] : data.tags }, () => {
      setSubmitInProgress(false)
    }, () => {
      setSubmitInProgress(false)
    })
  }
  return (
    <Form className={className} onSubmit={handleSubmit(onSubmitForm)}>
      <FormField>
        <label htmlFor={`${id}_message`}>Message</label>
        <Input
          fullWidth
          id={`${id}_message`}
          type="textarea"
          name="message"
          placeholder="Message shown to the students"
          ref={register({
            required: true,
            minLength: 1
          })}/>
        <Error>
          {errors.message && 'Message must be between 1 to 10240 characters.'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor={`${id}_metadata`}>Metadata</label>
        <Input
          fullWidth
          id={`${id}_metadata`}
          type="textarea"
          name="metadata"
          placeholder="Metadata only visible to the teachers"
          ref={register}/>
        <Error>
          {errors.metadata && 'Metadata must be less than 10240 characters.'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor={`${id}_tags`}>Tags</label>
        <MultiInput
          fullWidth
          type="text"
          name="tags"
          id={`${id}_tags`}
          placeholder="Zero or more tags"
          value={tagsText}
          items={fields.map(f => f.name)}
          onChange={handleTagsTextChange}
          onAddItem={addTag}
          onRemoveItem={removeTag}
        />
        { fields.map((f, i) =>
        <input
          key={`rft_${f.id}_${i}`}
          type="hidden"
          name={`tags[${i}]`}
          defaultValue={f.name}
          ref={register()}
        />
        )}
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
  white-space: break-spaces;
`
const Buttons = styled.div`
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`

export const AddReviewForm = styled(AddReviewFormEl)``
