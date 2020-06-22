import React, { memo } from 'react'
import styled from 'styled-components'

import { SelectCourseExercise } from '../SelectCourseExercise'
import { SearchFlowsModelTabsMenu } from './SearchFlowsModelTabsMenu'
import { SearchConsole } from './SearchConsole'
import { SearchResultsList } from './SearchResultsList'
import { LeftPanel } from './LeftPanel'
import { Button } from '../../elements/Button'

interface IProps {
  className?: string
}

const SearchViewEl = memo((props: IProps) => {
  const { className } = props
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
      <SearchFlowsModelTabsMenu />
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
const Body = styled.div`
  display: flex;
  & > ${SearchResultsList} {
    margin: 0 2rem;
  }
`

export const SearchView = styled(SearchViewEl)``
