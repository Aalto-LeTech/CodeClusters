import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

import { ClusteringResults } from './ClusteringResults'
import { Button } from '../../elements/Button'
import { Icon } from '../../elements/Icon'

import { ModelStore } from '../../stores/ModelStore'

interface IProps {
  className?: string
  modelStore?: ModelStore
}

const ClustersEl = inject('modelStore')(observer((props: IProps) => {
  const {
    className, modelStore
  } = props
  const [minimized, setMinimized] = useState(true)
  const disabled = modelStore!.latestRunNgram === undefined

  function handleClickToggle() {
    setMinimized(!minimized)
  }
  return (
    <Container className={className}>
      <Header>
        <Button onClick={handleClickToggle} disabled={disabled}>
          <Title>{`${minimized ? 'Show' : 'Hide'} clusters`}</Title>
        </Button>
        <Icon button onClick={handleClickToggle} disabled={disabled}>
          { minimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
        </Icon>
      </Header>
      <Body minimized={minimized}>
        <ClusteringResults />
      </Body>
    </Container>
  )
}))

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 1rem;
  margin-top: 0.75rem;
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  max-width: 700px;
  width: 100%;
`
const Title = styled.h2`
  margin: 0;
`
const Body = styled.div<{ minimized: boolean}>`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.18);
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: space-around;
  margin-top: 0.75rem;
  padding: 1rem;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
`

export const Clusters = styled(ClustersEl)``
