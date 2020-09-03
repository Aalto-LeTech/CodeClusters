import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ClustersHistogram } from '../Plots/ClustersHistogram'
import { ClustersScatterPlot } from '../Plots/ClustersScatterPlot'

import { IRunNgramResponse } from 'shared'
import { Stores } from '../../stores'

interface IProps {
  className?: string
  activeCluster?: string
  getNgramHistogramData?: {
    cluster: string
    name: string
    count: number
  }[]
  getNgramScatterData?: {
    id: string
    x: number
    y: number
    cluster: number
  }[]
  latestRunNgram?: IRunNgramResponse | undefined
  setActiveCluster?: (cluster: string) => void
}

const ClusteringResultsEl = inject((stores: Stores) => ({
  activeCluster: stores.clustersStore.activeCluster,
  getNgramHistogramData: stores.clustersStore.ngramHistogramData,
  getNgramScatterData: stores.clustersStore.ngramScatterData,
  latestRunNgram: stores.clustersStore.latestRunNgram,
  setActiveCluster: stores.clustersStore.setActiveCluster,
}))
(observer((props: IProps) => {
  const { className, activeCluster, getNgramHistogramData, getNgramScatterData, latestRunNgram, setActiveCluster } = props
  const silhouette_score = latestRunNgram ? latestRunNgram.ngram.silhouette_score : undefined
  const score = silhouette_score ? silhouette_score.toPrecision(3) : 'none'

  function handleClickBar(item: any) {
    setActiveCluster!(item.cluster)
  }
  if (latestRunNgram === undefined) {
    return <Container className={className}></Container>
  }
  return (
    <Container className={className}>
      <Title>Ngram clusters</Title>
      <p>Silhouette score: {score}</p>
      <Plots>
        <ClustersHistogram
          data={getNgramHistogramData || []}
          activeCluster={activeCluster || ''}
          onClickBar={handleClickBar}
        />
        <ClustersScatterPlot
          data={getNgramScatterData || []}
          clusters={getNgramHistogramData?.length || 0}
        />
      </Plots>
    </Container>
  )
}))

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`
const Title = styled.h3``
const Plots = styled.div`
  align-items: center;
  display: flex;
`

export const ClusteringResults = styled(ClusteringResultsEl)``
