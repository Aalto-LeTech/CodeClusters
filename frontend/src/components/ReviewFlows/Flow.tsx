import React, { memo } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { Button } from '../../elements/Button'

import { Stores } from '../../stores'
import { IReviewFlow } from 'shared'

interface IProps {
  className?: string
  selectedFlow?: IReviewFlow
}

const FlowEl = inject((stores: Stores) => ({
  selectedFlow: stores.reviewFlowStore.selectedFlow,
}))
(observer((props: IProps) => {
  const { className, selectedFlow } = props

  function handleClick(e: React.MouseEvent<HTMLElement>) {
  }
  if (selectedFlow === undefined) {
    return (
      <Container className={className}>
        No review flows
      </Container>
    )
  }
  return (
    <Container className={className}>
      <Header>
        <FlowTitle>{selectedFlow.title}</FlowTitle>
        <Description>{selectedFlow.description}</Description>
        <Note>This review has been ran before with these parameters!</Note>
      </Header>
      <FlowStepsList>
        {selectedFlow.steps.map((s =>
        <FlowStepItem key={s.index}>
          <Action>{s.action}</Action>
          <Parameters>{s.parameters}</Parameters>
        </FlowStepItem>
        ))}
      </FlowStepsList>
      <Controls>
        <Button intent="success">Run and review</Button>
      </Controls>
    </Container>
  )
}))

const Container = styled.div`
  background: #ededed;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 1rem;
`
const Header = styled.div`
  margin-bottom: 1rem;
`
const FlowTitle = styled.h3`
  margin: 0;
`
const Description = styled.p`
  margin: 1rem 0;
`
const Note = styled.small``
const FlowStepsList = styled.div`
  display: flex;
  flex-direction: column;
`
const FlowStepItem = styled.div`
  border: 2px solid black;
  border-radius: 0.25rem;
  display: flex;
  padding: 0.5rem;
  &:not(:first-child) {
    margin-top: 0.5rem;
  }
`
const Action = styled.div`
  width: 100px;
`
const Parameters = styled.div``
const Controls = styled.div`
  display: flex;
  margin-top: 1rem;
`

export const Flow = styled(FlowEl)``
