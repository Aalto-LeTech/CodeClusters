import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { Button } from '../../elements/Button'

import { Stores } from '../../stores'

interface IProps {
  className?: string
  reindexSubmissions?: () => Promise<any>
}

const ReindexEl = inject((stores: Stores) => ({
  reindexSubmissions: stores.indexStore.reindexSubmissions,
}))
(observer((props: IProps) => {
  const { className, reindexSubmissions } = props
  const [loading, setLoading] = useState(false)
  function handleReindex() {
    setLoading(true)
    reindexSubmissions!().then(() => setLoading(false))
  }
  return (
    <Container className={className}>
      <Header>
        <h2>Reindex</h2>
        <Info>
          <InfoText>
            Here you can reindex the data contained by Solr when necessary (instead of having to ssh into the server).
            <br />
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

export const Reindex = styled(ReindexEl)``
