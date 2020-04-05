import React, { memo, useMemo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiChevronDown, FiChevronUp, FiTrash } from 'react-icons/fi'

import { Flow } from './Flow'
import { TabsMenu } from '../../elements/TabsMenu'
import { DropdownSearch } from '../../elements/DropdownSearch'
import { Button } from '../../elements/Button'
import { Icon } from '../../elements/Icon'

import { IReviewFlow } from 'shared'
import { ReviewFlowStore, ReviewFlowFilterType } from '../../stores/ReviewFlowStore'

interface IProps {
  className?: string
  reviewFlowStore?: ReviewFlowStore
}

const ReviewFlowsEl = inject('reviewFlowStore')(observer((props: IProps) => {
  const { className, reviewFlowStore } = props
  const [loading, setLoading] = useState(false)
  const [minimized, setMinimized] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setLoading(true)
    reviewFlowStore!.getReviewFlows().then((flows) => {
      setLoading(false)
      if (flows.length > 0) {
        setSearchValue(flows[0].title)
      }
    })
  }, [])

  function handleSelectTabOption(o: { key: string, value: string }) {
    reviewFlowStore!.setFilteredBy(o.key as ReviewFlowFilterType)
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
  return (
    <Container className={className}>
      <Header>
        <Button onClick={handleClickToggle}>
          <Title>{`${minimized ? 'Show' : 'Hide'} review flows`}</Title>
        </Button>
        <Icon button onClick={handleClickToggle}>
          { minimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
        </Icon>
      </Header>
      <Body minimized={minimized}>
        <TabsMenu
          options={reviewFlowStore!.tabFilterOptions}
          selected={reviewFlowStore!.getCurrentFilterOption}
          onSelect={handleSelectTabOption}
        />
        <DropdownSearch
          fullWidth
          options={reviewFlowStore!.getCurrentFlows.map(r => ({ key: r.title, value: r.title }))}
          value={searchValue}
          onChange={handleSearchChange}
          onSelect={handleSelectReviewFlow}
        />
        <Flow/>
      </Body>
    </Container>
  )
}))

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 1rem;
  margin-top: 0.75rem;
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  max-width: 700px;
  width: 100%;
`
const Title = styled.h2`
  margin: 0;
`
const Body = styled.div<{ minimized: boolean}>`
  background: #ededed;
  border-radius: 4px;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.18);
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: space-around;
  margin-top: 0.75rem;
  max-width: 700px;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
  & > ${DropdownSearch} {
    margin: 1rem 0 0 1rem;
    width: 400px;
  }
`

export const ReviewFlows = styled(ReviewFlowsEl)``
