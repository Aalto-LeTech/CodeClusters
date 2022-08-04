import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'

import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import { ClusteringAlgoType } from '@codeclusters/types'
import { INgramFormParams } from '../../types/forms'

interface IProps {
  className?: string
  id: string
}

const CLUSTERING_OPTIONS = [
  { key: 'DBSCAN', value: 'DBSCAN' },
  { key: 'HDBSCAN', value: 'HDBSCAN' },
  { key: 'OPTICS', value: 'OPTICS' },
  { key: 'KMeans', value: 'K-means' },
] as { key: ClusteringAlgoType, value: string }[]

const CLUSTERING_INFO = [
  {
    key: 'DBSCAN',
    text: 'DBSCAN is a popular density-based clustering method.',
    link: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html'
  },
  {
    key: 'HDBSCAN',
    text: 'HDBSCAN is a hierarchial version of DBSCAN, which finds automatically the optimal eps (along with other things).',
    link: 'https://hdbscan.readthedocs.io/en/latest/index.html'
  },
  {
    key: 'OPTICS',
    text: 'OPTICS is very similar to DBSCAN, but it tries overcome its weakness of detecting clusters with varying density.',
    link: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.OPTICS.html'
  },
  {
    key: 'KMeans',
    text: 'K-means is a distance-based clustering method which tries to cluster all the points to user-specified amount of clusters.',
    link: 'https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html'
  }
]

const SelectClusteringAlgoEl = (props: IProps) => {
  const { className, id } = props
  const { register, watch, getValues, setValue } = useFormContext<INgramFormParams>()
  const [clusteringAlgo, setClusteringAlgo] = useState<ClusteringAlgoType>(getValues('selected_clustering_algo'))
  const clusteringInfo = useMemo(() => CLUSTERING_INFO.find(c => c.key === clusteringAlgo), [clusteringAlgo])
  const clusteringAlgoChanged = watch('selected_clustering_algo')
  useEffect(() => {
    setClusteringAlgo(getValues('selected_clustering_algo'))
  }, [clusteringAlgoChanged])

  function handleClustAlgoChange(opt: { key: ClusteringAlgoType, value: string }) {
    setValue('selected_clustering_algo', opt.key)
  }
  return (
    <Container className={className}>
      <legend>Clustering algorithm</legend>
      <Body>
        <FormField>
          <label>&nbsp;</label>
          <ClusteringDropdown
            selected={clusteringAlgo}
            options={CLUSTERING_OPTIONS}
            onSelect={handleClustAlgoChange}
          />
          <input
            type="hidden"
            name="selected_clustering_algo"
            ref={register}
          />
          <ClusteringDescription>
            {clusteringInfo?.text}
          </ClusteringDescription>
          <ClusteringLink href={clusteringInfo?.link} target="_blank" rel="noopener">
            Documentation
          </ClusteringLink>
        </FormField>
        <DBSCANFields id={id} visible={clusteringAlgo === 'DBSCAN'}/>
        <HDBSCANFields id={id} visible={clusteringAlgo === 'HDBSCAN'}/>
        <OPTICSFields id={id} visible={clusteringAlgo === 'OPTICS'}/>
        <KMeansFields id={id} visible={clusteringAlgo === 'KMeans'}/>
      </Body>
    </Container>
  )
}

interface IClusteringFieldsProps {
  id: string
  visible: boolean
}

function DBSCANFields({ id, visible }: IClusteringFieldsProps) {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <ClusteringFields visible={visible}>
      <FormField>
        <label htmlFor={`${id}_DBSCAN.min_samples`}>Min samples</label>
        <Input
          id={`${id}_DBSCAN.min_samples`}
          name="DBSCAN.min_samples"
          type="number"
          placeholder="Must be >0"
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.DBSCAN?.min_samples && 'Min samples should be higher than 0'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor={`${id}_DBSCAN.eps`}>Eps</label>
        <Input
          id={`${id}_DBSCAN.eps`}
          name="DBSCAN.eps"
          type="number"
          placeholder="DBSCAN eps"
          step={0.01}
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.DBSCAN?.eps && 'DBSCAN eps must be between 0-1'}
        </Error>
      </FormField>
    </ClusteringFields>
  )
}

function HDBSCANFields({ id, visible }: IClusteringFieldsProps) {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <ClusteringFields visible={visible}>
      <FormField>
        <label htmlFor={`${id}_DBSCAN.min_cluster_size`}>Min cluster size</label>
        <Input
          id={`${id}_DBSCAN.min_cluster_size`}
          name="HDBSCAN.min_cluster_size"
          type="number"
          placeholder="Must be >1"
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.HDBSCAN?.min_cluster_size && 'HDBSCAN min cluster size must be higher than 1'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor={`${id}_HDBSCAN.min_samples`}>Min samples</label>
        <Input
          id={`${id}_HDBSCAN.min_samples`}
          name="HDBSCAN.min_samples"
          type="number"
          placeholder="Must be >0"
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.HDBSCAN?.min_samples && 'Min samples should be higher than 0'}
        </Error>
      </FormField>
    </ClusteringFields>
  )
}

function OPTICSFields({ id, visible }: IClusteringFieldsProps) {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <ClusteringFields visible={visible}>
      <FormField>
        <label htmlFor={`${id}_OPTICS.min_samples`}>Min samples</label>
        <Input
          id={`${id}_OPTICS.min_samples`}
          name="OPTICS.min_samples"
          type="number"
          placeholder="Must be >0"
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.OPTICS?.min_samples && 'Min samples should be higher than 0'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor={`${id}_OPTICS.max_eps`}>Max eps</label>
        <Input
          id={`${id}_OPTICS.max_eps`}
          name="OPTICS.max_eps"
          type="number"
          placeholder="Empty for np.inf"
          title="Empty for np.inf"
          step={0.01}
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.OPTICS?.max_eps && 'Max eps should be >0 or empty'}
        </Error>
      </FormField>
    </ClusteringFields>
  )
}

function KMeansFields({ id, visible }: IClusteringFieldsProps) {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <ClusteringFields visible={visible}>
      <FormField>
        <label htmlFor={`${id}_KMeans.k_clusters`}>K clusters</label>
        <Input
          id={`${id}_KMeans.k_clusters`}
          name="KMeans.k_clusters"
          type="number"
          placeholder="K must be >1"
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.KMeans?.k_clusters && 'K-means clusters should be >1'}
        </Error>
      </FormField>
    </ClusteringFields>
  )
}

const ClusteringDropdown = styled(GenericDropdown<ClusteringAlgoType, string>())`
  width: 100%;
`

const Container = styled.fieldset`
`
const Body = styled.div`
  display: flex;
  width: 100%;
`
const ClusteringDescription = styled.p`
  width: 200px;
`
const ClusteringLink = styled.a``
const ClusteringFields = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'block' : 'none'};
  margin-left: 1rem;
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  & > *:not(:first-child) {
    margin-top: 0.5rem;
  }
`
const FormField = styled.div`
  display: flex;
  flex-direction: column;
`
const Error = styled.small`
  color: red;
`

export const SelectClusteringAlgo = styled(SelectClusteringAlgoEl)``
