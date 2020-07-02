import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { removeEmptyValues } from '../../utils/url'

import { SearchBar } from './SearchBar'
import { CheckBox } from '../../elements/CheckBox'
import { Input } from '../../elements/Input'
import { MultiInput } from '../../elements/MultiInput'

import { useDebouncedCallback } from '../../hooks/useDebounce'

import { ISearchCodeParams } from 'shared'

interface ISearchParams {
  num_results: number
  num_lines: number
  q: string
  custom_filters: string[]
  case_sensitive: boolean
  use_regex: boolean
  use_whole_words: boolean
}
interface IProps {
  className?: string
  id: string
  courseId?: number
  exerciseId?: number
  defaultSearchParams?: ISearchCodeParams
  onChange?: () => void
  onSearch: (payload: ISearchCodeParams) => Promise<any>
}

const SearchFormEl = observer(forwardRef((props: IProps, ref) => {
  const {
    className, id, defaultSearchParams, courseId, exerciseId, onChange, onSearch,
  } = props
  const { register, reset, control, clearError, setError, handleSubmit } = useForm<ISearchParams>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_filters',
  })
  const [filterText, setFilterText] = useState('')
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const handleSearch = useCallback(() => {
    if (submitButtonRef && submitButtonRef.current) {
      submitButtonRef.current.click()
    }
  }, [])
  const debouncedSearch = useDebouncedCallback(handleSearch, 500)

  useEffect(() => {
    if (defaultSearchParams) {
      resetValues(defaultSearchParams)
    }
  }, [defaultSearchParams])

  // See NgramParametersForm.tsx for explanation
  useImperativeHandle(ref, () => ({
    executeSubmit: (defaultData?: ISearchCodeParams) => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject('SearchForm'), 500)
      if (defaultData) {
        resetValues(defaultData)
      }
      handleSubmit((data: ISearchParams, e?: React.BaseSyntheticEvent) => {
        clearTimeout(timeout)
        resolve(normalizeFormData(data))
      })()
    }),
    reset: () => {
      reset({})
    },
  }), [])

  function resetValues(data: ISearchCodeParams) {
    const values = Object.keys(data).reduce((acc: any, k: string) => {
      const val = data[k]
      if (k === 'q' && val === '*') {
        acc[k] = ''
      } else if (k === 'custom_filters') {
        acc[k] = val.map((f: string) => ({ name: f }))
      } else {
        acc[k] = val
      }
      return acc
    }, {})
    reset(values)
  }
  function handleChange() {
    debouncedSearch()
    if (onChange) onChange()
  }
  function handleFilterTextChange(val: string) {
    setFilterText(val)
  }
  function addCustomFilter(item: string) {
    clearError('custom_filters')
    append({ id: item, name: item })
    handleChange()
  }
  function removeCustomFilter(item: string) {
    remove(fields.findIndex(f => f.name === item))
    if (fields.length <= 1) {
      setError('custom_filters', 'min_length', 'not enough')
    }
    handleChange()
  }
  function normalizeFormData(data: ISearchParams) {
    // Remove false, undefined and empty values since they are their default values
    // to keep the URL from being cluttered with redundant parameters
    const payload = removeEmptyValues(data) as ISearchCodeParams 
    if (payload.q === undefined) {
      payload.q = '*'
    }
    if (courseId) {
      payload.course_id = courseId
    }
    if (exerciseId) {
      payload.exercise_id = exerciseId
    }
    return payload
  }
  const onSubmit = async (data: ISearchParams, e?: React.BaseSyntheticEvent) => {
    onSearch!(normalizeFormData(data))
  }
  return (
    <Form className={className} onSubmit={handleSubmit(onSubmit)} id={id}>
      <TopRow>
        <FormField>
          <label htmlFor={`${id}_num_results`}>Results per page</label>
          <Input
            fullWidth
            type="number"
            name="num_results"
            id={`${id}_num_results`}
            placeholder="20"
            ref={register}
            onChange={handleChange}
          ></Input>
        </FormField>
        <FormField>
          <label htmlFor={`${id}_num_lines`}>Lines per result</label>
          <Input
            fullWidth
            type="number"
            name="num_lines"
            id={`${id}_num_lines`}
            placeholder="0 - return all the lines"
            ref={register}
            onChange={handleChange}
          ></Input>
        </FormField>
      </TopRow>
      <MiddleRow>
        <FormField>
          <label htmlFor={`${id}_custom_filters`}>Custom filters</label>
          <MultiInput
            fullWidth
            type="text"
            name="custom_filters"
            id={`${id}_custom_filters`}
            placeholder="Eg. student_id=1"
            value={filterText}
            items={fields.map(f => f.name)}
            onChange={handleFilterTextChange}
            onAddItem={addCustomFilter}
            onRemoveItem={removeCustomFilter}
          />
          { fields.map((f, i) =>
          <input
            key={`cf_${f.id}_${i}`}
            type="hidden"
            name={`custom_filters[${i}]`}
            defaultValue={f.name}
            ref={register()}
          />
          )}
        </FormField>
      </MiddleRow>
      <SearchRow>
        <label htmlFor={`${id}_search`}>Search</label>
        <SearchBar name="q" id={`${id}_search`} ref={register} onSearch={handleSearch}/>
      </SearchRow>
      <BottomRow>
        <CheckBoxField>
          <CheckBox
            id={`${id}_case_sensitive`}
            name="case_sensitive"
            ref={register}
            onChange={handleChange}
          />
          <CheckBoxText htmlFor={`${id}_case_sensitive`}>Case sensitive</CheckBoxText>
        </CheckBoxField>
        <CheckBoxField>
          <CheckBox
            id={`${id}_use_regex`}
            name="regex"
            ref={register}
            onChange={handleChange}
          />
          <CheckBoxText htmlFor={`${id}_use_regex`}>Use regex</CheckBoxText>
        </CheckBoxField>
        <CheckBoxField>
          <CheckBox
            id={`${id}_use_whole_words`}
            name="whole_words"
            ref={register}
            onChange={handleChange}
          />
          <CheckBoxText htmlFor={`${id}_use_whole_words`}>Whole words</CheckBoxText>
        </CheckBoxField>
      </BottomRow>
      <HiddenSubmitButton type="submit" ref={submitButtonRef}></HiddenSubmitButton>
    </Form>
  )
}))

const Form = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  & > * + * {
    margin-top: 1rem;
  }
`
const FormField = styled.div`
  display: flex;
  flex-direction: column;
`
const CheckBoxField = styled.div`
  display: flex;
`
const CheckBoxText = styled.label`
  align-items: center;
  display: flex;
  margin-left: 8px;
`
const TopRow = styled.div`
  display: flex;
  width: 100%;
  & > ${FormField} {
    width: 100%;
    &:first-child {
      margin-right: 1rem;
    }
  }
`
const MiddleRow = styled.div`
  display: flex;
  width: 100%;
  & > ${FormField} {
    width: 100%;
  }
`
const SearchRow = styled.div`
  width: 100%;
`
const BottomRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 400px;
`
const HiddenSubmitButton = styled.button`
  display: none;
  visibility: none;
`

export const SearchForm = styled(SearchFormEl)`
`
