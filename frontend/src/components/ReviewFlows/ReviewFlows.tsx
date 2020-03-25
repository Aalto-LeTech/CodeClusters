import React, { memo, useMemo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiChevronDown, FiChevronUp, FiTrash } from 'react-icons/fi'

import { Flow } from './Flow'
import { TabsMenu } from '../../elements/TabsMenu'
import { Icon } from '../../elements/Icon'

import { ReviewFlowsStore } from '../../stores/ReviewFlowsStore'
import { IReviewFlow } from 'shared'

interface IProps {
  className?: string
  reviewFlowsStore?: ReviewFlowsStore
}

const TAB_OPTIONS = [
  'This exercise',
  'This course',
  'All flows',
  'Your flows'
]

const ReviewFlowsEl = inject('reviewFlowsStore')(observer((props: IProps) => {
  const { className, reviewFlowsStore } = props
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState(TAB_OPTIONS[0])
  const [minimized, setMinimized] = useState(false)
  useEffect(() => {
    setLoading(true)
    reviewFlowsStore!.getReviewFlows().then(() => {
      setLoading(false)
    })
  }, [])

  function handleSelectTabOption(o: string) {
    setSelectedOption(o)
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
          options={TAB_OPTIONS}
          selected={selectedOption}
          onSelect={handleSelectTabOption}
        />
        <Flow reviewFlow={reviewFlowsStore!.selectedFlow}/>
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
`

export const ReviewFlows = styled(ReviewFlowsEl)``
