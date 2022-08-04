import React from 'react'
import styled from '../theme/styled'

import { ManualView } from '../components/ManualPage/ManualView'

interface IProps {}

export const ManualPage = (props: IProps) => {
  return (
    <Container>
      <ManualView />
    </Container>
  )
}

const Container = styled.div``
