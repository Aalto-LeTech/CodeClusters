import React, { memo, useRef, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { useForm } from 'react-hook-form'

import { SearchBar } from '../Search/SearchBar'
import { CheckBox } from '../../elements/CheckBox'
import { Input } from '../../elements/Input'

import { useDebouncedCallback } from '../../hooks/useDebounce'

import { Stores } from '../../stores'
import { ISearchCodeParams } from 'shared'

interface IProps {
  className?: string
  search?: (payload: ISearchCodeParams) => void
  activateLocalSearch?: () => void
}

const LocalSearchFormEl = inject((stores: Stores) => ({
  search: stores.localSearchStore.search,
  activateLocalSearch: () => stores.localSearchStore.setActive(true),
}))
(observer((props: IProps) => {
  const {
    className, search, activateLocalSearch
  } = props
  const { register, handleSubmit } = useForm({})
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const debouncedSearch = useDebouncedCallback(handleSearch, 500)

  function handleChange() {
    debouncedSearch()
    activateLocalSearch!()
  }
  function handleSearch() {
    activateLocalSearch!()
    if (submitButtonRef && submitButtonRef.current) {
      submitButtonRef.current.click()
    }
  }
  const onSubmit = async (data: any, e?: React.BaseSyntheticEvent) => {
    const payload = data
    // Remove false, undefined and empty values since they are their default values
    Object.keys(payload).forEach(key => {
      if (key !== 'q' && (!payload[key] || payload[key] === '')) {
        delete payload[key]
      }
    })
    const result = await search!(payload)
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
              placeholder="200"
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
        <SearchRow>
          <label htmlFor="q">Local search</label>
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

export const LocalSearchForm = styled(LocalSearchFormEl)`
`