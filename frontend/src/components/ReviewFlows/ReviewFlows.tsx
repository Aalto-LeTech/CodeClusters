import React, { memo, useMemo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiChevronDown, FiChevronUp, FiTrash } from 'react-icons/fi'

import { Flow } from './Flow'
import { TabsMenu } from '../../elements/TabsMenu'
import { DropdownSearch } from '../../elements/DropdownSearch'
import { Icon } from '../../elements/Icon'

import { ReviewFlowStore, ReviewFlowFilterType } from '../../stores/ReviewFlowStore'
import { IReviewFlow } from 'shared'

interface IProps {
  className?: string
  reviewFlowStore?: ReviewFlowStore
}

const ReviewFlowsEl = inject('reviewFlowStore')(observer((props: IProps) => {
  const { className, reviewFlowStore } = props
  const [loading, setLoading] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchOptions, setSearchOptions] = useState(getSearchOptions())

  useEffect(() => {
    setLoading(true)
    reviewFlowStore!.getReviewFlows().then((flows) => {
      setLoading(false)
      setSearchOptions(getSearchOptions())
      if (flows.length > 0) {
        setSearchValue(flows[0].title)
      }
    })
  }, [])

  function getSearchOptions() {
    return reviewFlowStore!.currentReviewFlows.map(r => ({ key: r.title, value: r.title }))
  }
  function handleSelectTabOption(o: { key: string, value: string }) {
    reviewFlowStore!.filterReviewFlows(o.key as ReviewFlowFilterType)
    setSearchOptions(getSearchOptions())
  }
  function handleSearchChange(title: string) {
    setSearchValue(title)
  }
  function handleSelectReviewFlow(option: { key: string, value: string }) {
    reviewFlowStore!.setSelectedFlow(option.key)
  }
  function handleClickToggle() {
    setMinimized(!minimized)
  }
  function handleClick(e: React.MouseEvent<HTMLElement>) {
  }
  return (
    <Container className={className}>
      <Header>
        <Title>Saved review flows</Title>
        <Icon button onClick={handleClickToggle}>
          { minimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
        </Icon>
      </Header>
      <Body minimized={minimized}>
        <TabsMenu
          options={reviewFlowStore!.filterOptions}
          selected={reviewFlowStore!.getCurrentFilterOption}
          onSelect={handleSelectTabOption}
        />
        <DropdownSearch
          fullWidth
          options={searchOptions}
          value={searchValue}
          onChange={handleSearchChange}
          onSelect={handleSelectReviewFlow}
        />
        <Flow/>
      </Body>
    </Container>
  )
}))

const Container = styled.div`
  background: #ededed;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 1rem;
  padding: 1rem;
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const Title = styled.h2`
  margin: 0;
`
const Body = styled.div<{ minimized: boolean}>`
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: space-around;
  margin-top: 1rem;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
  & > ${DropdownSearch} {
    margin: 1rem 0 0 1rem;
    width: 400px;
  }
`

export const ReviewFlows = styled(ReviewFlowsEl)``
