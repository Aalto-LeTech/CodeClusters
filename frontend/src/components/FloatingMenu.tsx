import React, { memo, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiCheck, FiPlusSquare, FiFolderPlus, FiTrash } from 'react-icons/fi'

import { Icon } from '../elements/Icon'

import { ReviewStore } from '../stores/ReviewStore'

interface IProps {
  className?: string
  reviewStore?: ReviewStore
}
export const FloatingMenu = inject('reviewStore')(observer((props: IProps) => {
  const { className, reviewStore } = props
  function handleReviewClick() {
  }
  function handleToggleShownClick() {
  }
  function handleAddAllClick() {
  }
  function handleTrashClick() {
  }
  return (
    <Wrapper className={className}>
      <Container>
        <Header>
          <Title>Selected: 0/0</Title>
        </Header>
        <Body>
          <Icon button onClick={handleReviewClick} tooltip="Review selected"><FiCheck size={18}/></Icon>
          <Icon button onClick={handleToggleShownClick} tooltip="Add all shown"><FiPlusSquare size={18}/></Icon>
          <Icon button onClick={handleAddAllClick} tooltip="Add all found"><FiFolderPlus size={18}/></Icon>
          <Icon button onClick={handleTrashClick} tooltip="Unselect all"><FiTrash size={18}/></Icon>
        </Body>
      </Container>
    </Wrapper>
  )
}))

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`
const Title = styled.h4`
  margin: 0;
`
const Wrapper = styled.div`
  bottom: 20px;
  right: 20px;
  position: fixed;
  z-index: 10;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.TABLET_WIDTH}) {
    bottom: 0;
    right: 0;
  }
`
const Container = styled.div`
  align-items: center;
  background: #fff;
  border: 1px solid #222;
  border-radius: 4px;
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  color: #222;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`
const Body = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
  width: 100%;
  & > ${Icon}:not(:first-child) {
    margin-left: 0.5rem
  }
`