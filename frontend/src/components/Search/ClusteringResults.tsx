import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ClustersHistogram } from '../Plots/ClustersHistogram'
import { ClustersScatterPlot } from '../Plots/ClustersScatterPlot'

import { ModelStore } from '../../stores/ModelStore'

interface IProps {
  className?: string
  modelStore?: ModelStore
}

const ClusteringResultsEl = inject('modelStore')(observer((props: IProps) => {
  const { className, modelStore } = props
  function handleClickBar(item: any) {
    console.log(item)
  }
  if (modelStore!.latestRunNgram === undefined) {
    return <Container className={className}></Container>
  }
  return (
    <Container className={className}>
      <PlotTitle>Ngram clusters</PlotTitle>
      <ClustersHistogram data={modelStore!.getNgramHistogramData} onClickBar={handleClickBar}/>
      <ClustersScatterPlot data={modelStore!.getNgramScatterData} clusters={modelStore!.getNgramHistogramData.length}/>
    </Container>
  )
}))

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`
const PlotTitle = styled.h3``

export const ClusteringResults = styled(ClusteringResultsEl)``
