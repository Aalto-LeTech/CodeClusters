import React from 'react'
import styled from 'styled-components'

import { Reindex } from './Reindex'
import { IndexMetrics } from './IndexMetrics'

interface IProps {
  className?: string
}

function SolrViewEl(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <Header>
        <h1>Solr</h1>
        <Info>
          <InfoText>
            The search of CodeClusters is powered by Apache Solr.
            <br />
            <br></br>
            Here you can reset and index the data to the Solr as necessary instead of having to do
            it manually by ssh'ing into the server.
          </InfoText>
        </Info>
      </Header>
      <MainInputs>
        <Reindex />
        <IndexMetrics />
      </MainInputs>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > * + * {
    margin: 1rem 0;
  }
`
const Header = styled.header`
  display: flex;
  flex-direction: column;
  & > h1 {
    margin-top: 1rem;
  }
`
const Info = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`
const InfoText = styled.p`
  margin: 0;
`
const MainInputs = styled.div`
  width: 100%;
  & > * + * {
    margin: 1rem 0;
  }
`

export const SolrView = styled(SolrViewEl)``
