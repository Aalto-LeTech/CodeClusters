import React, { memo, useRef, useState } from 'react'
import styled from 'styled-components'

import { SearchBar } from './SearchBar'
import { CheckBox } from '../elements/CheckBox'
import { Input } from '../elements/Input'
import { MultiInput } from '../elements/MultiInput'

interface IProps {
  className?: string
  // onSubmit: (data: IRunClusteringParams) => Promise<IRunClusteringResponse | undefined>
}

const SearchConsoleEl = (props: IProps) => {
  const {
    className
  } = props
  const [course, setCourse] = useState(2)
  const [exercise, setExercise] = useState(1)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [useWholeWords, setUseWholeWords] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [wordFilters, setWordFilters] = useState([] as string[])
  const [submitInProgress, setSubmitInProgress] = useState(false)
  function hasNoError() {
    return true
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
  async function handleSearch(val: string) { // e: React.FormEvent
    if (hasNoError()) {
      console.log(val)
      // let filters = wordFilters
      // if (filterText.length > 0) {
      //   filters = [...wordFilters, filterText]
      //   setWordFilters(filters)
      //   setFilterText('')
      // }
      // const payload = {
      //   course_id: course,
      //   exercise_id: exercise,
      //   word_filters: filters,
      // }
      // setSubmitInProgress(true)
      // const result = await props.onSubmit(payload)
      // if (result) {
      //   setSubmitInProgress(false)
      // } else {
      //   setSubmitInProgress(false)
      // }
    }
  }
  return (
    <Container className={className}>
      <Form>
        <TopRow>
          <FormField>
            <label>Course</label>
            <Input
              fullWidth
              type="number"
              value={course}
              onChange={(val: number) => setCourse(val)}
            ></Input>
          </FormField>
          <FormField>
            <label>Exercise</label>
            <Input
              fullWidth
              type="number"
              value={exercise}
              onChange={(val: number) => setExercise(val)}
            ></Input>
          </FormField>
        </TopRow>
        <SearchBar onSearch={handleSearch}/>
        <MiddleRow>
          <CheckBoxField>
            <CheckBox checked={caseSensitive} onChange={(val: boolean) => setCaseSensitive(val)}/>
            <CheckBoxText>Case sensitive</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox checked={useRegex} onChange={(val: boolean) => setUseRegex(val)}/>
            <CheckBoxText>Use regex</CheckBoxText>
          </CheckBoxField>
          <CheckBoxField>
            <CheckBox checked={useWholeWords} onChange={(val: boolean) => setUseWholeWords(val)}/>
            <CheckBoxText>Whole words</CheckBoxText>
          </CheckBoxField>
        </MiddleRow>
        <BottomRow>
          <FormField>
            <label>Filters</label>
            <MultiInput
              type="text"
              fullWidth
              value={filterText}
              items={wordFilters}
              placeholder="Eg. while"
              onChange={handleFilterTextChange}
              onAddItem={handleWordAdd}
              onRemoveItem={handleWordRemove}
            ></MultiInput>
          </FormField>
        </BottomRow>
      </Form>
    </Container>
  )
}

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
  & > ${SearchBar} {
    width: 600px;
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
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 400px;
`
const BottomRow = styled.div`
  display: flex;
  width: 600px;
  & > ${FormField} {
    width: 100%;
  }
`

export const SearchConsole = styled(SearchConsoleEl)`
`
