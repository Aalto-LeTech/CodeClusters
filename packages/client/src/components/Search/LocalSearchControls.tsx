import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiX } from 'react-icons/fi'

import { Icon } from '../../elements/Icon'

import { LocalSearchForm } from './LocalSearchForm'
import { SelectCluster } from '../Model/SelectCluster'

interface IProps {
  className?: string
  visible: boolean
  onClose: () => void
}

const LocalSearchControlsEl = observer((props: IProps) => {
  const { className, visible, onClose } = props
  return (
    <Container className={className} visible={visible}>
      <Header>
        <TitleWrapper><h2>Explore modeling results</h2></TitleWrapper>
        <Icon button onClick={onClose}><FiX size={24}/></Icon>
      </Header>
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
  margin: 2rem auto 0 auto;
  max-width: 700px;
  padding: 1rem 1rem 2rem;
  visibility: ${({ visible }) => visible ? 'initial' : 'hidden'};
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  width: 100%;
`
const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 40px;
  width: 100%;
  & > h2 {
    font-size: 1.5rem;
    margin: 0;
    padding: 0;
  }
`

export const LocalSearchControls = styled(LocalSearchControlsEl)``
