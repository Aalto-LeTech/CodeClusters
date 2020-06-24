import React, { memo, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { useForm } from 'react-hook-form'

import { SearchBar } from './SearchBar'
import { CheckBox } from '../../elements/CheckBox'
import { Input } from '../../elements/Input'
import { MultiInput } from '../../elements/MultiInput'

import { useDebouncedCallback } from '../../hooks/useDebounce'

import { ISearchCodeParams, ISolrSearchCodeResponse } from 'shared'

function removeEmptyValues(obj: {[key: string]: any}) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!obj[key] || obj[key] === '' || obj[key].length === 0) {
      return acc
    }
    return { ...acc, [key]: obj[key] }
  }, {})
}

interface ISearchParams {
  num_results: number
  num_lines: number
  q: string
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

const SearchFormEl = observer((props: IProps) => {
  const {
    className, id, defaultSearchParams, courseId, exerciseId, onChange, onSearch,
  } = props
  const { register, setValue, handleSubmit } = useForm<ISearchParams>({})
  const [filterText, setFilterText] = useState('')
  const [wordFilters, setWordFilters] = useState([] as string[])
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const debouncedSearch = useDebouncedCallback(handleSearch, 500)

  useEffect(() => {
    const values = Object.keys(defaultSearchParams || {}).map(k => {
      const val = defaultSearchParams![k]
      if (k === 'q' && val === '*') {
        return { [k]: '' }
      }
      return { [k]: val }
    })
    setValue(values)
  }, [defaultSearchParams])

  function handleChange() {
    debouncedSearch()
    onChange!()
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
  function handleSearch() {
    if (submitButtonRef && submitButtonRef.current) {
      submitButtonRef.current.click()
    }
  }
  const onSubmit = async (data: ISearchParams, e?: React.BaseSyntheticEvent) => {
    const payload: ISearchCodeParams = data
    if (payload.q === undefined || payload.q === '') {
      payload.q = '*'
    }
    if (courseId) {
      payload.course_id = courseId
    }
    if (exerciseId) {
      payload.exercise_id = exerciseId
    }
    setSubmitInProgress(true)
    // Remove false, undefined and empty values since they are their default values
    // to keep the URL from being cluttered with redundant parameters
    const pruned = removeEmptyValues(payload) as ISearchCodeParams
    onSearch!(pruned).finally(() => {
      setSubmitInProgress(false)
    })
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
            items={wordFilters}
            onChange={handleFilterTextChange}
            onAddItem={handleWordAdd}
            onRemoveItem={handleWordRemove}
          ></MultiInput>
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
})

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
  padding: 3px 0;
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
