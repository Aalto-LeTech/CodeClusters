import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { FlowSteps } from './FlowSteps'
import { Button } from '../../elements/Button'

import { Stores } from '../../stores/Stores'
import { IReviewFlow, IReviewFlowRunParams } from '@codeclusters/types'

interface IProps {
  className?: string
  selectedFlow?: IReviewFlow
  runReviewFlow?: (params: IReviewFlowRunParams) => Promise<any>
}

const FlowEl = inject((stores: Stores) => ({
  selectedFlow: stores.reviewFlowStore.selectedFlow,
  runReviewFlow: stores.reviewFlowStore.runReviewFlow,
}))(
  observer((props: IProps) => {
    const { className, selectedFlow, runReviewFlow } = props
    const [loading, setLoading] = useState(false)

    function handleClickRunReviewFlow() {
      setLoading(true)
      runReviewFlow!({
        steps: selectedFlow?.steps || [],
      }).then((result) => {
        setLoading(false)
      })
    }
    if (selectedFlow === undefined) {
      return <Container className={className}>No review flows</Container>
    }
    return (
      <Container className={className}>
        <Header>
          <FlowTitle>{selectedFlow.title}</FlowTitle>
          <Description>{selectedFlow.description}</Description>
          <Note>This review has been ran before with these parameters!</Note>
        </Header>
        <FlowSteps steps={selectedFlow.steps} />
        <Controls>
          <Button intent="success" loading={loading} onClick={handleClickRunReviewFlow}>
            Run and review
          </Button>
          <Button intent="success">Edit</Button>
        </Controls>
      </Container>
    )
  })
)

const Container = styled.div`
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
const Controls = styled.div`
  display: flex;
  margin-top: 1rem;
  > * + * {
    margin-left: 1rem;
  }
`

export const Flow = styled(FlowEl)``
