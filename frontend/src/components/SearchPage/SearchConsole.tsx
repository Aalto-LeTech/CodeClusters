import React, { memo, useEffect, useRef, useState } from 'react'
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
import { ISearchCodeParams, ISolrSearchCodeResponse } from 'shared'

function removeEmptyValues(obj: {[key: string]: any}) {
  return Object.keys(obj).reduce((acc, key) => {
    if (!obj[key] || obj[key] === '' || obj[key].length === 0) {
      return acc
    }
    return { ...acc, [key]: obj[key] }
  }, {})
}
function createSearchQueryParams(obj: {[key: string]: any}) {
  return Object.keys(obj).reduce((acc, cur, i) => cur !== 'q' ? `${acc}&${cur}=${obj[cur]}` : acc, `?q=${obj.q}`)
}

interface IProps extends RouteComponentProps {
  className?: string
  courseId?: number
  exerciseId?: number
  searchParams?: ISearchCodeParams
  search?: (payload: ISearchCodeParams) => Promise<ISolrSearchCodeResponse | undefined>
  deactivateLocalSearch?: () => void
}

const SearchConsoleEl = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  searchParams: stores.searchStore.searchParams,
  search: stores.searchStore.search,
  deactivateLocalSearch: () => stores.localSearchStore.setActive(false),
}))
(observer(withRouter((props: IProps) => {
  const {
    className, history, search, deactivateLocalSearch, searchParams, courseId, exerciseId
  } = props
  const { register, setValue, handleSubmit } = useForm({})
  const [filterText, setFilterText] = useState('')
  const [wordFilters, setWordFilters] = useState([] as string[])
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const debouncedSearch = useDebouncedCallback(handleSearch, 500)

  useEffect(() => {
    const values = Object.keys(searchParams || {}).map(k => {
      const val = searchParams![k]
      if (k === 'q' && val === '*') {
        return { [k]: '' }
      }
      return { [k]: val }
    })
    setValue(values)
    history.push(createSearchQueryParams(removeEmptyValues(searchParams!)))
  }, [searchParams])

  function handleChange() {
    debouncedSearch()
    deactivateLocalSearch!()
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
  const onSubmit = async (data: Partial<ISearchCodeParams>, e?: React.BaseSyntheticEvent) => {
    const payload = data
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
    const result = await search!(pruned)
    history.push(createSearchQueryParams(pruned))
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
              id="num_results"
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
              id="num_lines"
              placeholder="0 - return all the lines"
              ref={register}
              onChange={handleChange}
            ></Input>
          </FormField>
        </TopRow>
        <MiddleRow>
          <FormField>
            <label htmlFor="custom_filters">Custom filters</label>
            <MultiInput
              fullWidth
              type="text"
              name="custom_filters"
              id="custom_filters"
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
          <label htmlFor="search">Search</label>
          <SearchBar name="q" id="search" ref={register} onSearch={handleSearch}/>
        </SearchRow>
        <BottomRow>
          <CheckBoxField>
            <CheckBox
              id="case_sensitive"
              name="case_sensitive"
              ref={register}
              onChange={handleChange}
            />
            <CheckBoxText htmlFor="case_sensitive">Case sensitive</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox
              id="use_regex"
              name="regex"
              ref={register}
              onChange={handleChange}
            />
            <CheckBoxText htmlFor="use_regex">Use regex</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox
              id="use_whole_words"
              name="whole_words"
              ref={register}
              onChange={handleChange}
            />
            <CheckBoxText htmlFor="use_whole_words">Whole words</CheckBoxText>
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
const CheckBoxText = styled.label`
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