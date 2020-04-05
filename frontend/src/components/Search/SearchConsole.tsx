import React, { memo, useRef, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { useForm } from 'react-hook-form'
import { withRouter, RouteComponentProps } from 'react-router'

import { SearchBar } from './SearchBar'
import { CheckBox } from '../../elements/CheckBox'
import { Input } from '../../elements/Input'
import { MultiInput } from '../../elements/MultiInput'

import { useDebouncedCallback } from '../../hooks/useDebounce'

import { Stores } from '../../stores'
import { SearchStore } from '../../stores/SearchStore'
import { CourseStore } from '../../stores/CourseStore'
import { ISearchCodeParams, ISearchCodeResponse } from 'shared'

function createQueryParams(obj: {[key: string]: string | number}) {
  return Object.keys(obj).reduce((acc, cur, i) => cur !== 'q' ? `${acc}&${cur}=${obj[cur]}` : acc, `?q=${obj.q}`)
}

interface IProps extends RouteComponentProps {
  className?: string
  searchStore?: SearchStore
  courseStore?: CourseStore
}

const SearchConsoleEl = inject((stores: Stores) => ({
  searchStore: stores.searchStore,
  courseStore: stores.courseStore,
}))
(observer(withRouter((props: IProps) => {
  const {
    className, history, searchStore, courseStore
  } = props
  const { register, handleSubmit } = useForm({})
  const [filterText, setFilterText] = useState('')
  const [wordFilters, setWordFilters] = useState([] as string[])
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const debouncedSearch = useDebouncedCallback(handleSearch, 500)

  function handleChange() {
    debouncedSearch()
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
  const onSubmit = async (data: any, e?: React.BaseSyntheticEvent) => {
    const payload = data
    if (payload.q === undefined || payload.q === '') {
      payload.q = '*'
    }
    const courseId = courseStore!.courseId
    const exerciseId = courseStore!.exerciseId
    if (courseId) {
      payload.course_id = courseId
    }
    if (exerciseId) {
      payload.exercise_id = exerciseId
    }
    // Remove false, undefined and empty values since they are their default values
    // to keep the URL from being cluttered with redundant parameters
    Object.keys(payload).forEach(key => {
      if (!payload[key] || payload[key] === '') {
        delete payload[key]
      }
    })
    setSubmitInProgress(true)
    const result = await searchStore!.search(payload)
    history.push(createQueryParams(payload))
    if (result) {
      setSubmitInProgress(false)
    } else {
      setSubmitInProgress(false)
    }
  }
  return (
    <Container className={className}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TopRow>
          <FormField>
            <label htmlFor="num_results">Results per page</label>
            <Input
              fullWidth
              type="number"
              name="num_results"
              placeholder="20"
              ref={register}
              onChange={handleChange}
            ></Input>
          </FormField>
          <FormField>
            <label htmlFor="num_lines">Lines per result</label>
            <Input
              fullWidth
              type="number"
              name="num_lines"
              placeholder="0 - return all the lines"
              ref={register}
              onChange={handleChange}
            ></Input>
          </FormField>
        </TopRow>
        <MiddleRow>
          <FormField>
            <label>Custom filters</label>
            <MultiInput
              fullWidth
              type="text"
              name="custom_filters"
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
          <label htmlFor="q">Search</label>
          <SearchBar name="q" ref={register} onSearch={handleSearch}/>
        </SearchRow>
        <BottomRow>
          <CheckBoxField>
            <CheckBox
              name="case_sensitive"
              ref={register}
              onChange={handleChange}
            />
            <CheckBoxText>Case sensitive</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox
              name="regex"
              ref={register}
              onChange={handleChange}
            />
            <CheckBoxText>Use regex</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox
              name="whole_words"
              ref={register}
              onChange={handleChange}
            />
            <CheckBoxText>Whole words</CheckBoxText>
          </CheckBoxField>
        </BottomRow>
        <HiddenSubmitButton type="submit" ref={submitButtonRef}></HiddenSubmitButton>
      </Form>
    </Container>
  )
})))

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const Form = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  & > * {
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
const CheckBoxText = styled.div`
  align-items: center;
  display: flex;
  padding: 3px 0;
`
const TopRow = styled.div`
  display: flex;
  width: 600px;
  & > ${FormField} {
    width: 100%;
    &:first-child {
      margin-right: 1rem;
    }
  }
`
const MiddleRow = styled.div`
  display: flex;
  width: 600px;
  & > ${FormField} {
    width: 100%;
  }
`
const SearchRow = styled.div`
  width: 600px;
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

export const SearchConsole = styled(SearchConsoleEl)`
`
