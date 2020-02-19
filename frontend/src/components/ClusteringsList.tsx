import React from 'react'
import { observer } from 'mobx-react'
import styled from '../theme/styled'

import { IRunClusteringResponse } from 'shared'

interface IProps {
  className?: string
  clusterings: IRunClusteringResponse[]
}

const ClusteringsListEl = observer((props: IProps) => {
  const { className, clusterings } = props
  return (
    <ClusteringsListUl className={className}>
      { clusterings.map((res: IRunClusteringResponse) =>
        Object.keys(res.ngram.clusters).map((key) =>
        <ClusteringsListItem key={key}>
          <p>Cluster: {key}</p>
          <p>Submissions: <span>[{res.ngram.clusters[key].join(', ')}]</span></p>
        </ClusteringsListItem>  
        )
      )}
    </ClusteringsListUl>
  )
})

const ClusteringsListUl = styled.ul`
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
`

export const ClusteringsList = styled(ClusteringsListEl)``
