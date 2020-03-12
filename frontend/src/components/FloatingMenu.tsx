import React, { memo, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiChevronDown, FiChevronUp, FiTrash } from 'react-icons/fi'

import useTimeout from '../hooks/useTimeout'

import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { ReviewStore } from '../stores/ReviewStore'
import { ITheme } from '../types/theme'

interface IProps {
  className?: string
  reviewStore?: ReviewStore
}
export const FloatingMenu = inject('reviewStore')(observer((props: IProps) => {
  const { className, reviewStore } = props
  const [minimized, setMinimized] = useState(false)
  function handleClickToggle() {
    setMinimized(!minimized)
  }
  function handleTrashClick() {
    reviewStore!.reset()
  }
  return (
    <Wrapper className={className}>
      <Container>
        <Header>
          <Title>Currently selected: {reviewStore!.currentSelectionCount}</Title>
          <Icon button onClick={handleClickToggle}>
            { minimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
          </Icon>
        </Header>
        <Body minimized={minimized}>
          <Button intent="success">Review</Button>
          <Icon button onClick={handleTrashClick}><FiTrash size={18}/></Icon>
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
const Wrapper = styled.div`
  bottom: 20px;
  right: 20px;
  max-width: 600px;
  position: fixed;
  width: 220px;
  z-index: 10;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.TABLET_WIDTH}) {
    bottom: 0;
    right: 0;
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
  justify-content: space-around;
  margin-top: 1rem;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
`
