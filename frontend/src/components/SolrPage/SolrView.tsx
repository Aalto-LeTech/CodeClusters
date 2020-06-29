import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { Button } from '../../elements/Button'

import { SolrStore } from '../../stores/SolrStore'

interface IProps {
  className?: string
  solrStore?: SolrStore
}

const SolrViewEl = inject('solrStore')(observer((props: IProps) => {
  const { className, solrStore } = props
  const [loading, setLoading] = useState(false)
  function handleReindex() {
    setLoading(true)
    solrStore!.reindexSubmissions().then(() => setLoading(false))
  }
  return (
    <Container className={className}>
      <Header>
        <h1>Solr</h1>
        <Info>
          <InfoText>
            Apache Solr is the search library used by CodeClusters for the code search.
            <br />
            Here you can reindex the data contained by Solr when necessary (instead of having to ssh into the server).
          </InfoText>
        </Info>
      </Header>
      <SolrControls>
        <Button loading={loading} onClick={handleReindex}>Reindex</Button>
      </SolrControls>
    </Container>
  )
}))

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > * + * {
    margin: 2rem 0;
  }
`
const Header = styled.header`
  display: flex;
  flex-direction: column;
`
const Info = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`
const InfoText = styled.p`
  margin: 0;
`
const SolrControls = styled.div`
  > * + * {
    margin: 1rem 0;
  }
`

export const SolrView = styled(SolrViewEl)``
