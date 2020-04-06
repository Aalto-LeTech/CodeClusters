import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ClustersHistogram } from '../Plots/ClustersHistogram'
import { ClustersScatterPlot } from '../Plots/ClustersScatterPlot'

import { ClustersStore } from '../../stores/ClustersStore'

interface IProps {
  className?: string
  clustersStore?: ClustersStore
}

const ClusteringResultsEl = inject('clustersStore')(observer((props: IProps) => {
  const { className, clustersStore } = props
  function handleClickBar(item: any) {
    console.log(item)
    clustersStore!.setActiveCluster(item.cluster)
  }
  if (clustersStore!.latestRunNgram === undefined) {
    return <Container className={className}></Container>
  }
  return (
    <Container className={className}>
      <Title>Ngram clusters</Title>
      <Plots>
        <ClustersHistogram
          data={clustersStore!.getNgramHistogramData}
          activeCluster={clustersStore!.activeCluster}
          onClickBar={handleClickBar}
        />
        <ClustersScatterPlot
          data={clustersStore!.getNgramScatterData}
          clusters={clustersStore!.getNgramHistogramData.length}
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
