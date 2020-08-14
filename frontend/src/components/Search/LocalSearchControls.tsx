import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { LocalSearchForm } from './LocalSearchForm'
import { SelectCluster } from '../Model/SelectCluster'

interface IProps {
  className?: string
  visible: boolean
}

const LocalSearchControlsEl = observer((props: IProps) => {
  const { className, visible } = props
  return (
    <Container className={className} visible={visible}>
      <LocalSearchForm />
      <SelectCluster/>
    </Container>
  )
})

const Container = styled.section<{ visible: boolean}>`
  align-items: center;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  flex-direction: column;
  margin: 2rem auto;
  max-width: 700px;
  padding: 1rem 1rem 2rem;
  visibility: ${({ visible }) => visible ? 'initial' : 'hidden'};
`

export const LocalSearchControls = styled(LocalSearchControlsEl)``
