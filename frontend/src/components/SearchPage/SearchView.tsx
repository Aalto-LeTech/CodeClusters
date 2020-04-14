import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { SelectCourseExercise } from '../SelectCourseExercise'
import { SearchConsole } from './SearchConsole'
import { ReviewFlows } from '../ReviewFlows'
import { Modeling } from '../Model'
import { SearchResultsList } from './SearchResultsList'
import { LeftPanel } from './LeftPanel'
import { Button } from '../../elements/Button'

interface IProps {
  className?: string
}

const SearchViewEl = memo((props: IProps) => {
  const { className } = props
  function handleCreateReviewFlow() {
    console.log('should open a modal')
  }
  return (
    <Container className={className}>
      <Info>
        <InfoText>
          Note: both Course and Exercise fields are optional.
          <br />
          Although running models on the whole indexed data is not advised.
        </InfoText>
      </Info>
      <SelectCourseExercise />
      <ReviewFlows />
      <PreviousQueries>
        <div>arrow left</div>
        <div>previous query 1</div>
        <div>previous query 2</div>
        <div>arrow right</div>
      </PreviousQueries>
      <SearchConsole />
      <ExtraControls>
        <Buttons>
          <Button>Select all</Button>
          <Button onClick={handleCreateReviewFlow}>Save result</Button>
          <Button>Create review flow</Button>
          <Button>Visualize</Button>
        </Buttons>
      </ExtraControls>
      <Modeling />
      <Body>
        <LeftPanel />
        <SearchResultsList />
      </Body>
    </Container>
  )
})

const Container = styled.section`
  & > ${SearchConsole} {
    margin-bottom: 1.5rem;
  }
`
const Info = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 0 1rem 1rem;
`
const InfoText = styled.p`
  margin: 0;
`
const PreviousQueries = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  max-width: 700px;
  width: 100%;
  & > * {
    background: #ededed;
    border: 1px solid black;
    border-radius: 4px;
    height: 50px;
    margin-right: 1rem;
    padding: 0.5rem;
    width: 100px;
  }
`
const Body = styled.div`
  display: flex;
  & > ${SearchResultsList} {
    margin: 0 2rem;
  }
`
const ExtraControls = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1.5rem;
`
const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 600px;
  & > ${Button} {
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
`

export const SearchView = styled(SearchViewEl)``
