import React, { memo, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiTrash } from 'react-icons/fi'

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
  function handleTrashClick() {
    reviewStore!.reset()
  }
  return (
    <Wrapper className={className}>
      <Container>
        <Title>Currently selected: {reviewStore!.selectedSubmissions.length}</Title>
        <Body>
          <Button intent="success">Review</Button>
          <Icon button onClick={handleTrashClick}><FiTrash size={18}/></Icon>
        </Body>
      </Container>
    </Wrapper>
  )
}))

const SvgWrapper = styled.span`
  display: flex;
`
const Title = styled.h4`
  margin: 0 0 1rem 0;
`
const Wrapper = styled.div`
  bottom: 20px;
  right: 20px;
  max-width: 600px;
  position: fixed;
  width: 20vw;
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
const Number = styled.span`
  background: #222;
  border-radius: 20px;
  color: #fff;
  margin-right: 0.5rem;
  padding: 8px 13px;
`
const Body = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`
