import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { SearchConsole } from './SearchConsole'
import { ReviewFlows } from '../ReviewFlows'
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
      <ReviewFlows />
      <SearchConsole />
      <ExtraControls>
        <Buttons>
          <Button>Select all</Button>
          <Button onClick={handleCreateReviewFlow}>Save result</Button>
          <Button>Create review flow</Button>
          <Button>Visualize</Button>
        </Buttons>
      </ExtraControls>
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
