import React, { memo, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiChevronDown, FiChevronUp, FiTrash } from 'react-icons/fi'

import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { StateStore } from '../stores/StateStore'
import { ITheme } from '../types/theme'

interface IProps {
  className?: string
  stateStore?: StateStore
}
export const FloatingSetStateMenu = inject('stateStore')(observer((props: IProps) => {
  const { className, stateStore } = props
  const [minimized, setMinimized] = useState(false)
  function handleClickToggleState() {
    stateStore!.setToState(stateStore!.getInactiveState)
  }
  return (
    <Wrapper className={className}>
      <Container>
        <Header>
          <Title>State: {stateStore!.state}</Title>
        </Header>
        <Body minimized={minimized}>
          <Button intent="info" onClick={handleClickToggleState}>
            Set to {stateStore!.getInactiveState}
          </Button>
        </Body>
      </Container>
    </Wrapper>
  )
}))

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const Title = styled.h4`
  margin: 0;
`
const Text = styled.p``
const Wrapper = styled.div`
  bottom: 20px;
  left: 20px;
  max-width: 600px;
  position: fixed;
  width: 220px;
  z-index: 10;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.TABLET_WIDTH}) {
    bottom: 0;
    left: 0;
  }
`
const Container = styled.div`
  align-items: center;
  background: #fff;
  border: 2px solid #222;
  border-radius: 4px;
  color: #222;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`
const Body = styled.div<{ minimized: boolean}>`
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  margin-top: 1rem;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
`
