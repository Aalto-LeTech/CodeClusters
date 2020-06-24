import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { FormContext, useForm } from 'react-hook-form'
import Joi from "@hapi/joi"
import merge from 'lodash.merge'

import { SelectClusteringAlgo } from './SelectClusteringAlgo'
import { SelectDimVisualization } from './SelectDimVisualization'
import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import {
  INgramParams, TokenSetType, NgramModelId,
  ClusteringAlgoType, IDBSCANParams, IHDBSCANParams, IOPTICSParams, IKMeansParams,
  DimVisualizationType, ITSNEParams, IUMAPParams,
} from 'shared'
import { Stores } from '../../stores'

type TokenSetOption = { key: TokenSetType, value: string }

const TOKEN_SET_OPTIONS = [
  { key: 'modified', value: 'modified' },
  { key: 'complete', value: 'complete' },
  { key: 'keywords', value: 'keywords' }
] as TokenSetOption[]
const DEFAULT_TOKEN_SET = 'modified'
const CLUSTERING_OPTIONS = [
  'DBSCAN',
  'HDBSCAN',
  'OPTICS',
  'KMeans',
]
const DIM_VISUALIZATION_OPTIONS = [
  'TSNE',
  'UMAP'
]

// A schema is required to convert the numbers and booleans, as otherwise all values are strings
const validationSchema = Joi.object({
  token_set: Joi.string().valid('modified', 'keywords'),
  min_ngrams: Joi.number().integer().min(1),
  max_ngrams: Joi.number().integer().min(1),
  random_seed: Joi.number().integer().min(-1),
  selected_clustering_algo: Joi.string().required(),
  selected_dim_visualization: Joi.string().required(),
  DBSCAN: Joi.object({
    min_samples: Joi.number().min(0),
    eps: Joi.number().min(0),
  }),
  HDBSCAN: Joi.object({
    min_cluster_size: Joi.number().min(2),
    min_samples: Joi.number().min(0),
    show_linkage_tree: Joi.boolean(),
  }),
  OPTICS: Joi.object({
    min_samples: Joi.number().min(0),
    max_eps: Joi.number().min(0).empty('')
  }),
  KMeans: Joi.object({
    k_clusters: Joi.number().min(2),
  }),
  TSNE: Joi.object({
    svd_n_components: Joi.number().min(1).empty(''),
    perplexity: Joi.number().min(0),
  }),
  UMAP: Joi.object({
    n_neighbors: Joi.number().integer().min(2),
    min_dist: Joi.number().min(0),
  }),
})

const resolver = (data: INgramFormParams, validationContext?: object) => {
  const { error, value: values } = validationSchema.validate(data, {
    abortEarly: false
  })
  function createError(msg: string, path: string[]) : Object {
    if (path.length > 1) {
      return {
        [path[0]]: createError(msg, path.slice(1))
      }
    }
    return {
      [path[0]]: { msg }
    }
  }
  const errors = error?.details.reduce((acc, currentError) => {
    const key = currentError.path[0].toString()
    // Omit errors from clustering algos that are not currently selected
    if (CLUSTERING_OPTIONS.includes(key) && key !== values.selected_clustering_algo) {
      return acc
    }
    // Same but for dim visualization
    if (DIM_VISUALIZATION_OPTIONS.includes(key) && key !== values.selected_dim_visualization) {
      return acc
    }
    return merge(acc, createError(currentError.message, currentError.path.map(p => p.toString())))
  }, {}) || {}
  return {
    values,
    errors,
  }
}

export interface INgramFormParams {
  token_set: 'modified' | 'keywords'
  min_ngrams: number
  max_ngrams: number
  random_seed: number
  selected_clustering_algo: ClusteringAlgoType
  selected_dim_visualization: DimVisualizationType
  // This Required-Omit hack omits the name, and makes all the properties defined.
  // Otherwise the errors-object won't infer the maybe values eg. eps?: number
  DBSCAN: Required<Omit<IDBSCANParams, 'name'>>
  HDBSCAN: Required<Omit<IHDBSCANParams, 'name'>>
  OPTICS: Required<Omit<IOPTICSParams, 'name'>>
  KMeans: Required<Omit<IKMeansParams, 'name'>>
  TSNE: Required<Omit<ITSNEParams, 'name'>>
  UMAP: Required<Omit<IUMAPParams, 'name'>>
}
interface IProps {
  className?: string
  visible: boolean
  initialData: Partial<INgramParams>
  onSubmit?: (data: INgramParams) => Promise<any>
  onCancel: () => void
}

const NgramParametersFormEl = observer(forwardRef((props: IProps, ref) => {
  const { className, visible, initialData, onSubmit, onCancel } = props
  const methods = useForm<INgramFormParams>({
    validationResolver: resolver,
    defaultValues: {
      random_seed: initialData?.random_seed || -1,
      min_ngrams: initialData?.ngrams && initialData.ngrams[0] || 5,
      max_ngrams: initialData?.ngrams && initialData.ngrams[1] || 5,
      selected_clustering_algo: initialData?.clustering_params?.name || 'DBSCAN',
      selected_dim_visualization: initialData?.dim_visualization_params?.name || 'TSNE',
      DBSCAN: initialData?.clustering_params?.name !== 'DBSCAN' ? {
        min_samples: 5,
        eps: 0.25,
      } : initialData?.clustering_params,
      HDBSCAN: initialData?.clustering_params?.name !== 'HDBSCAN' ? {
        min_cluster_size: 2,
        min_samples: 5,
        show_linkage_tree: false,
      } : initialData?.clustering_params,
      OPTICS: initialData?.clustering_params?.name !== 'OPTICS' ? {
        min_samples: 5,
        max_eps: undefined,
      } : initialData?.clustering_params,
      KMeans: initialData?.clustering_params?.name !== 'KMeans' ? {
        k_clusters: 2,
      } : initialData?.clustering_params,
      TSNE: initialData?.dim_visualization_params?.name !== 'TSNE' ? {
        svd_n_components: undefined,
        perplexity: 30,
      }: initialData?.dim_visualization_params,
      UMAP: initialData?.dim_visualization_params?.name !== 'UMAP' ? {
        n_neighbors: 30,
        min_dist: 0.0,
      }: initialData?.dim_visualization_params,
    }
  })
  const { register, errors, triggerValidation, getValues, handleSubmit } = methods
  const [tokenSet, setTokenSet] = useState<TokenSetType>(DEFAULT_TOKEN_SET)
  const [submitInProgress, setSubmitInProgress] = useState(false)

  // This kludge is for programmatically triggering submit from the CreateReviewFlowModal of the form.
  // This way the data is validated and parsed using the Joi schema (and transformed with normalizeFormData)
  // Other ways would have been even more annoying, this will do for now
  useImperativeHandle(ref, () => ({
    executeSubmit: (handler: (data: INgramParams) => Promise<void>) => handleSubmit(handleExecuteSubmit(handler))(),
  }))

  // JavaScript currying from hell. But hey at least I omitted the implicit return for the last one.
  const handleExecuteSubmit =
    (handler: (data: INgramParams) => Promise<void>) =>
    (data: INgramFormParams, e?: React.BaseSyntheticEvent) => {
    return handler(normalizeFormData(data))
  }

  function normalizeFormData(data: INgramFormParams) : INgramParams {
    const {
      min_ngrams, max_ngrams, random_seed, selected_clustering_algo, selected_dim_visualization
    } = data
    const payload = {
      model_id: NgramModelId,
      token_set: tokenSet,
      ngrams: [min_ngrams, max_ngrams] as [number, number],
      random_seed,
      clustering_params: {
        name: selected_clustering_algo,
        ...data[selected_clustering_algo]
      },
      dim_visualization_params: {
        name: selected_dim_visualization,
        ...data[selected_dim_visualization]
      }
    }
    return payload
  }
  function handleTokenSetChange(o: TokenSetOption) {
    setTokenSet(o.key)
  }
  const onFormSubmit = async (data: INgramFormParams, e?: React.BaseSyntheticEvent) => {
    setSubmitInProgress(true)
    onSubmit!(normalizeFormData(data)).then(result => {
      setSubmitInProgress(false)
    })
  }
  return (
    <FormContext {...methods} >
      <Form onSubmit={handleSubmit(onFormSubmit)} className={className} visible={visible}>
        <TopRow>
          <FormField>
            <label htmlFor="token_set">Token set</label>
            <TokenSetDropdown
              id="token_set"
              selected={tokenSet}
              options={TOKEN_SET_OPTIONS}
              onSelect={handleTokenSetChange}
            />
          </FormField>
          <FormField>
            <label htmlFor="ngrams">N-grams</label>
            <MinMaxGram>
              <Input
                id="min_ngrams"
                name="min_ngrams"
                type="number"
                placeholder="Min n"
                fullWidth
                ref={register}/>
              <Input
                id="max_ngrams"
                name="max_ngrams"
                type="number"
                placeholder="Max n"
                fullWidth
                ref={register}/>
            </MinMaxGram>
            <Error>
              {errors.min_ngrams && 'Min n-gram must be 1-9 and lower than the max n-gram'}
            </Error>
            <Error>
              {errors.max_ngrams && 'Max n-gram must be between 1-9'}
            </Error>
          </FormField>
          <FormField className="random_seed">
            <label htmlFor="random_seed">Random seed</label>
            <Input
              type="number"
              name="random_seed"
              id="random_seed"
              fullWidth
              ref={register}/>
            <Error>
              {errors.random_seed && '-1 or empty for no seed, otherwise >=0'}
            </Error>
          </FormField>
        </TopRow>
        <MiddleRow>
          <SelectClusteringAlgo />
          <SelectDimVisualization />
        </MiddleRow>
        { onSubmit && <Buttons>
          <Button
            type="submit"
            intent="success"
            disabled={submitInProgress}
            loading={submitInProgress}
          >Submit</Button>
          <Button
            intent="transparent"
            onClick={onCancel}
          >Cancel</Button>
        </Buttons>}
      </Form>
    </FormContext>
  )
}))

const TokenSetDropdown = GenericDropdown<TokenSetType, string>()

const Form = styled.form<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'initial' : 'none'};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
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
const MiddleRow = styled.div`
  display: flex;
  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`
const FormField = styled.div`
  display: flex;
  flex-direction: column;
  &.random_seed > ${Input} {
    width: 80px;
  }
`
const Error = styled.small`
  color: red;
`
const MinMaxGram = styled.div`
  display: flex;
  width: 150px;
  > * + * {
    margin-left: 1rem;
  }
`
const Buttons = styled.div`
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`

export const NgramParametersForm = styled(NgramParametersFormEl)``
