import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from '../theme/styled'

import { Button } from '../elements/Button'
import { SelectItem } from '../elements/SelectItem'

import { IRunClusteringResponse } from 'shared'

interface IProps {
  className?: string
  clusterings: IRunClusteringResponse[]
}

const ClusteringsListEl = observer((props: IProps) => {
  const { className, clusterings } = props
  const [selectedClusteringIdx, setSelectedClusteringIdx] = useState(0)

  function handleSelectClustering(i: number) {
    setSelectedClusteringIdx(i)
  }
  function handleFetchCodeClick(key: string) {

  }
  const results = clusterings.length > 0 ? clusterings[selectedClusteringIdx].ngram.clusters : []
  return (
    <Container>
      <h2>Ran clusterings</h2>
      <SelectItem
        currentItemIdx={selectedClusteringIdx}
        itemsCount={clusterings.length}
        onSelectItem={handleSelectClustering}
      />
      <h2>Parameters</h2>
      <h2>Clusters</h2>
      <ResultList className={className}>
        { Object.keys(results).map((key) =>
          <ClusteringsListItem key={key}>
            <p>Cluster: {key}</p>
            <p>Submissions: <span>[{results[key].join(', ')}]</span></p>
            <div className="controls">
              <Button onClick={() => handleFetchCodeClick(key)}>Fetch the code</Button>
            </div>
          </ClusteringsListItem>  
        )}
      </ResultList>
    </Container>
  )
})

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const ResultList = styled.ul`
`
const ClusteringsListItem = styled.li`
  background: #ededed;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  padding: 1rem;
  & > p {
    margin: 0 10px 0 0;
  }
  .code {
    background: #222;
    color: #fff;
    padding: 10px;
    border-radius: 0.25rem;
  }
  .message {
    background: rgba(255, 0, 0, 0.4);
    padding: 1rem;
    border-radius: 0.25rem;
  }
  .controls {
    margin-top: 1rem;
  }
`

export const ClusteringsList = styled(ClusteringsListEl)``
