import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'

import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import {
  IDBSCANParams, IHDBSCANParams, IKMeansParams, ClusteringAlgo, ClusteringAlgoType, ITSNEParams, IUMAPParams
} from 'shared'
import { INgramFormParams } from './NgramParametersForm'
import { Stores } from '../../stores'

interface IProps {
  className?: string
}

const CLUSTERING_OPTIONS = [
  { key: 'DBSCAN', value: 'DBSCAN' },
  { key: 'HDBSCAN', value: 'HDBSCAN' },
  { key: 'Kmeans', value: 'K-means' },
] as { key: ClusteringAlgoType, value: string }[]
const DEFAULT_CLUST_ALGO = 'DBSCAN'

const SelectClusteringAlgoEl = (props: IProps) => {
  const { className } = props
  const { register, errors } = useFormContext<INgramFormParams>()
  const [clusteringAlgo, setClusteringAlgo] = useState<ClusteringAlgoType>(DEFAULT_CLUST_ALGO)

  function handleClustAlgoChange(opt: { key: ClusteringAlgoType, value: string }) {
    setClusteringAlgo(opt.key)
    // onUpdate!({ token_set: opt.key })
  }
  return (
    <Container className={className}>
      <legend>Clustering algorithm</legend>
      <Body>
        <FormField>
          <ClusteringDropdown
            selected={clusteringAlgo}
            options={CLUSTERING_OPTIONS}
            onSelect={handleClustAlgoChange}
          />
          <HiddenInput
            name="clustering_params.name"
            ref={register({
              required: true,
            })}
          />
        </FormField>
        <FormField>
          <label htmlFor="eps">Eps</label>
          <Input
            id="eps"
            name="clustering_params.eps"
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
            {errors?.clustering_params && 'DBSCAN eps must be between 0-1'}
          </Error>
        </FormField>
      </Body>
    </Container>
  )
}

const ClusteringDropdown = GenericDropdown<ClusteringAlgoType, string>()

const Container = styled.fieldset`
`
const Body = styled.div`
  display: flex;
  width: 100%;
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
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
