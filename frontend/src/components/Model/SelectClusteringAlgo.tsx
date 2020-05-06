import React, { useState } from 'react'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'

import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import {
  ClusteringAlgoType
} from 'shared'
import { INgramFormParams } from './NgramParametersForm'

interface IProps {
  className?: string
}

const CLUSTERING_OPTIONS = [
  { key: 'DBSCAN', value: 'DBSCAN' },
  { key: 'HDBSCAN', value: 'HDBSCAN' },
  { key: 'OPTICS', value: 'OPTICS' },
  { key: 'KMeans', value: 'K-means' },
] as { key: ClusteringAlgoType, value: string }[]

const SelectClusteringAlgoEl = (props: IProps) => {
  const { className } = props
  const { register, getValues, setValue } = useFormContext<INgramFormParams>()
  const [clusteringAlgo, setClusteringAlgo] = useState<ClusteringAlgoType>(getValues('selected_clustering_algo'))

  function handleClustAlgoChange(opt: { key: ClusteringAlgoType, value: string }) {
    setClusteringAlgo(opt.key)
    setValue('selected_clustering_algo', opt.key)
  }
  return (
    <Container className={className}>
      <legend>Clustering algorithm</legend>
      <Body>
        <FormField>
          <label>&nbsp;</label>
          <ClusteringDropdown
            selected={getValues('selected_clustering_algo')}
            options={CLUSTERING_OPTIONS}
            onSelect={handleClustAlgoChange}
          />
          <HiddenInput
            name="selected_clustering_algo"
            ref={register}
          />
        </FormField>
        { clusteringAlgo === 'DBSCAN' && <DBSCANFields />}
        { clusteringAlgo === 'HDBSCAN' && <HDBSCANFields />}
        { clusteringAlgo === 'OPTICS' && <OPTICSFields />}
        { clusteringAlgo === 'KMeans' && <KMeansFields />}
      </Body>
    </Container>
  )
}

function DBSCANFields() {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <FormField>
      <label htmlFor="DBSCAN.eps">Eps</label>
      <Input
        id="DBSCAN.eps"
        name="DBSCAN.eps"
        type="number"
        placeholder="DBSCAN eps"
        step={0.01}
        fullWidth
        ref={register({
          required: true,
          min: 0.0,
          max: 1.0,
        })}
      />
      <Error>
        {errors?.DBSCAN?.eps && 'DBSCAN eps must be between 0-1'}
      </Error>
    </FormField>
  )
}

function HDBSCANFields() {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <FormField>
      <label htmlFor="HDBSCAN.min_cluster_size">Min cluster size</label>
      <Input
        id="HDBSCAN.min_cluster_size"
        name="HDBSCAN.min_cluster_size"
        type="number"
        placeholder="Must be >1"
        fullWidth
        ref={register({
          required: true,
          min: 2,
        })}
      />
      <Error>
        {errors?.HDBSCAN?.min_cluster_size && 'HDBSCAN min cluster size must be higher than 1'}
      </Error>
    </FormField>
  )
}

function OPTICSFields() {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <FormField>
      <label htmlFor="OPTICS.min_samples">Min samples</label>
      <Input
        id="OPTICS.min_samples"
        name="OPTICS.min_samples"
        type="number"
        placeholder="Must be >0"
        fullWidth
        ref={register({
          required: true,
          min: 0,
        })}
      />
      <Error>
        {errors?.HDBSCAN?.min_samples && 'Min samples should be higher than 0'}
      </Error>
    </FormField>
  )
}

function KMeansFields() {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <FormField>
      <label htmlFor="KMeans.k_clusters">K clusters</label>
      <Input
        id="KMeans.k_clusters"
        name="KMeans.k_clusters"
        type="number"
        placeholder="K must be >1"
        fullWidth
        ref={register({
          required: true,
          min: 2,
        })}
      />
      <Error>
        {errors?.KMeans?.k_clusters && 'K-means clusters should be >1'}
      </Error>
    </FormField>
  )
}

const ClusteringDropdown = GenericDropdown<ClusteringAlgoType, string>()

const Container = styled.fieldset`
`
const Body = styled.div`
  display: flex;
  width: 100%;
  /* & > *:not(:first-child) {
    margin-top: 1rem;
  } */
`
const TopRow = styled.div`
  display: flex;
  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`
const HiddenInput = styled.input`
  display: none;
  visibility: hidden;
`
const FormField = styled.div`
  display: flex;
  flex-direction: column;
`
const Error = styled.small`
  color: red;
`

export const SelectClusteringAlgo = styled(SelectClusteringAlgoEl)``
