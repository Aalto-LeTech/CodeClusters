import React, { memo, useRef, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { useForm } from 'react-hook-form'

import { SearchBar } from './SearchBar'
import { CheckBox } from '../../elements/CheckBox'
import { Input } from '../../elements/Input'
import { MultiInput } from '../../elements/MultiInput'

import { SearchStore } from '../../stores/SearchStore'
import { ISearchParams, ISearchResponse } from 'shared'

interface IProps {
  className?: string
  searchStore?: SearchStore,
}

const SearchConsoleEl = inject('searchStore')(observer((props: IProps) => {
  const {
    className, searchStore
  } = props
  const { register, handleSubmit } = useForm({
    defaultValues: {
      course_id: 2,
      exercise_id: 1,
    }
  })
  const [filterText, setFilterText] = useState('')
  const [wordFilters, setWordFilters] = useState([] as string[])
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  function handleFilterTextChange(val: string) {
    setFilterText(val)
  }
  function handleWordAdd(item: string) {
    setWordFilters([...wordFilters, item])
  }
  function handleWordRemove(item: string) {
    setWordFilters(wordFilters.filter(w => w !== item))
  }
  function handleSearch(val: string) {
    if (submitButtonRef && submitButtonRef.current) {
      submitButtonRef.current.click()
    }
  }
  const onSubmit = async (data: any, e?: React.BaseSyntheticEvent) => {
    const payload = data
    if (payload.q === undefined || payload.q === '') {
      payload.q = '*'
    }
    setSubmitInProgress(true)
    const result = await searchStore!.search(payload)
    if (result) {
      setSubmitInProgress(false)
    } else {
      setSubmitInProgress(false)
    }
  }
  return (
    <Container className={className}>
      <Form id="search-form" onSubmit={handleSubmit(onSubmit)}>
        <TopRow>
          <FormField>
            <label>Course</label>
            <Input
              fullWidth
              type="number"
              name="course_id"
              ref={register}
            ></Input>
          </FormField>
          <FormField>
            <label>Exercise</label>
            <Input
              fullWidth
              type="number"
              name="exercise_id"
              ref={register}
            ></Input>
          </FormField>
        </TopRow>
        <MiddleRow>
          <FormField>
            <label>Filters</label>
            <MultiInput
              fullWidth
              type="text"
              name="filters"
              placeholder="Eg. while"
              value={filterText}
              items={wordFilters}
              onChange={handleFilterTextChange}
              onAddItem={handleWordAdd}
              onRemoveItem={handleWordRemove}
            ></MultiInput>
          </FormField>
        </MiddleRow>
        <SearchRow>
          <label>Search</label>
          <SearchBar name="q" ref={register} onSearch={handleSearch}/>
        </SearchRow>
        <BottomRow>
          <CheckBoxField>
            <CheckBox
              name="case_sensitive"
              ref={register}
            />
            <CheckBoxText>Case sensitive</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox
              name="regex"
              ref={register}
            />
            <CheckBoxText>Use regex</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox
              name="whole_words"
              ref={register}
            />
            <CheckBoxText>Whole words</CheckBoxText>
          </CheckBoxField>
        </BottomRow>
        <HiddenSubmitButton type="submit" ref={submitButtonRef}></HiddenSubmitButton>
      </Form>
    </Container>
  )
}))

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
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
