import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useFormContext } from 'react-hook-form'

import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import { DimVisualizationType } from 'shared'
import { INgramFormParams } from '../../types/forms'

interface IProps {
  className?: string
  id: string
}

const DIM_VISUALIZATION_OPTIONS = [
  { key: 'TSNE', value: 'TSNE' },
  { key: 'UMAP', value: 'UMAP' },
] as { key: DimVisualizationType, value: string }[]

const DIM_VISUALIZATION_INFO = [
  {
    key: 'TSNE',
    text: 'The staple method for visualizing high-dimensional data in lower dimension.',
    link: 'https://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html'
  },
  {
    key: 'UMAP',
    text: 'Similar to TSNE, but stretches out the points a little more and the results should not vary as much.',
    link: 'https://umap-learn.readthedocs.io/en/latest/'
  },
]

const SelectDimVisualizationEl = (props: IProps) => {
  const { className, id } = props
  const { register, watch, getValues, setValue } = useFormContext<INgramFormParams>()
  const [dimVisualization, setDimVisualization] = useState<DimVisualizationType>(getValues('selected_dim_visualization'))
  const clusteringInfo = useMemo(() => DIM_VISUALIZATION_INFO.find(c => c.key === dimVisualization), [dimVisualization])
  const dimVisualizationChanged = watch('selected_dim_visualization')

  useEffect(() => {
    setDimVisualization(getValues('selected_dim_visualization'))
  }, [dimVisualizationChanged])

  function handleDimVisualizationChange(opt: { key: DimVisualizationType, value: string }) {
    setValue('selected_dim_visualization', opt.key)
  }
  return (
    <Container className={className}>
      <legend>Dimension visualization</legend>
      <Body>
        <FormField>
          <label>&nbsp;</label>
          <DimVisualizationDropdown
            selected={dimVisualization}
            options={DIM_VISUALIZATION_OPTIONS}
            onSelect={handleDimVisualizationChange}
          />
          <input
            type="hidden"
            name="selected_dim_visualization"
            ref={register}
          />
          <DimVisualizationDescription>
            {clusteringInfo?.text}
          </DimVisualizationDescription>
          <DimVisualizationLink href={clusteringInfo?.link} target="_blank" rel="noopener">
            Documentation
          </DimVisualizationLink>
        </FormField>
        <TSNEFields id={id} visible={dimVisualization === 'TSNE'}/>
        <UMAPFields id={id} visible={dimVisualization === 'UMAP'}/>
      </Body>
    </Container>
  )
}

interface IDimVisualizationFieldsProps {
  id: string
  visible: boolean
}

function TSNEFields({ id, visible }: IDimVisualizationFieldsProps) {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <DimVisualizationFields visible={visible}>
      <FormField>
        <label htmlFor={`${id}_TSNE.perplexity`}>Perplexity</label>
        <Input
          id={`${id}_TSNE.perplexity`}
          name="TSNE.perplexity"
          type="number"
          placeholder="Must be >0"
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.TSNE?.perplexity && 'Perplexity should be higher than 0'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor={`${id}_TSNE.svd_n_components`}>SVD n-components</label>
        <Input
          id={`${id}_TSNE.svd_n_components`}
          type="number"
          name="TSNE.svd_n_components"
          placeholder="Empty for all dimensions"
          title="Empty for all dimensions"
          fullWidth
          ref={register}/>
        <Error>
          {errors?.TSNE?.svd_n_components && 'Empty or >0, at least 30 is recommended'}
        </Error>
      </FormField>
    </DimVisualizationFields>
  )
}

function UMAPFields({ id, visible }: IDimVisualizationFieldsProps) {
  const { register, errors } = useFormContext<INgramFormParams>()
  return (
    <DimVisualizationFields visible={visible}>
      <FormField>
        <label htmlFor={`${id}_UMAP.n_neighbors`}>N neighbors</label>
        <Input
          id={`${id}_UMAP.n_neighbors`}
          name="UMAP.n_neighbors"
          type="number"
          placeholder="Must be >1"
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.UMAP?.n_neighbors && 'N neighbors must be greater than 1'}
        </Error>
      </FormField>
      <FormField>
        <label htmlFor={`${id}_UMAP.min_dist`}>Min distance</label>
        <Input
          id={`${id}_UMAP.min_dist`}
          name="UMAP.min_dist"
          type="number"
          placeholder="Must be >=0.0"
          step={0.1}
          fullWidth
          ref={register}
        />
        <Error>
          {errors?.UMAP?.min_dist && 'Min distance should be >=0.0'}
        </Error>
      </FormField>
    </DimVisualizationFields>
  )
}

const DimVisualizationDropdown = styled(GenericDropdown<DimVisualizationType, string>())`
  width: 100%;
`

const Container = styled.fieldset`
`
const Body = styled.div`
  display: flex;
  width: 100%;
`
const DimVisualizationDescription = styled.p`
  width: 200px;
`
const DimVisualizationLink = styled.a``
const DimVisualizationFields = styled.div<{ visible: boolean }>`
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

export const SelectDimVisualization = styled(SelectDimVisualizationEl)``
