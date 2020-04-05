import React from 'react'
import styled from '../theme/styled'

interface IProps {
}

export function ModelPage(props: IProps) {
  return (
    <Container>
      <Header>
        <h1><a href="https://github.com/Aalto-LeTech/CodeClusters">Code Clusters</a></h1>
      </Header>
    </Container>
  )
}

const Container = styled.div`
`
const Header = styled.header`
  display: flex;
  justify-content: center;
  & > h1 {

  }
`
