import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { IReviewFlowStep } from '@codeclusters/types'

interface IProps {
  className?: string
  steps: IReviewFlowStep[]
}

const FlowStepsEl = observer((props: IProps) => {
  const { className, steps } = props
  return (
    <>
    <Title>Flow steps</Title>
    <FlowStepsList className={className}>
      {steps.map((s =>
      <FlowStepItem key={s.index}>
        <Action>{s.action}</Action>
        <Parameters>
          <pre>{JSON.stringify(s.data, null, 2)}</pre>
        </Parameters>
      </FlowStepItem>
      ))}
    </FlowStepsList>
    </>
  )
})

const Title = styled.h4``
const FlowStepsList = styled.ol`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`
const FlowStepItem = styled.li`
  background: ${({ theme }) => theme.color.bgLight};
  border-radius: 4px;
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  &:not(:first-child) {
    margin-top: 1rem;
  }
`
const Action = styled.h5`
  font-size: 1rem;
  margin: 0;
`
const Parameters = styled.div`
  & > pre {
    margin: 1rem 0 0 0;
    white-space: pre-wrap;
  }
`

export const FlowSteps = styled(FlowStepsEl)``
