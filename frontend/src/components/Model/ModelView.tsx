import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { ClusteringResults } from './ClusteringResults'
import { ModelParameters } from './ModelParameters'
import { SelectModel } from './SelectModel'

interface IProps {
  className?: string
}

const ModelViewEl = memo((props: IProps) => {
  const { className } = props
  return (
    <Container className={className}>
      <SelectModel />
      <ModelParameters />
      <ClusteringResults />
    </Container>
  )
})

const Container = styled.section`
`

export const ModelView = styled(ModelViewEl)``
