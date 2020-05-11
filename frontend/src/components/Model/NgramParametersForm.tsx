import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { FormContext, useForm } from 'react-hook-form'
import Joi from "@hapi/joi"
import merge from 'lodash.merge'

import { SelectClusteringAlgo } from './SelectClusteringAlgo'
import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import {
  INgramParams, TokenSetType, NgramModelId, ClusteringAlgo, ClusteringAlgoType,
  IDBSCANParams, IHDBSCANParams, IOPTICSParams, IKMeansParams
} from 'shared'
import { Stores } from '../../stores'

type TokenSetOption = { key: TokenSetType, value: string }

const TOKEN_SET_OPTIONS = [
  { key: 'modified', value: 'modified' },
  { key: 'keywords', value: 'keywords' }
] as TokenSetOption[]
const DEFAULT_TOKEN_SET = 'modified'

// A schema is required to convert the numbers and booleans, as otherwise all values are strings
const validationSchema = Joi.object({
  token_set: Joi.string().valid('modified', 'keywords'),
  min_ngrams: Joi.number().integer().min(1),
  max_ngrams: Joi.number().integer().min(1),
  svd_n_components: Joi.number().integer().min(1),
  random_seed: Joi.number().integer().min(-1),
  selected_clustering_algo: Joi.string().required(),
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
    max_eps: Joi.number().min(0).empty('').optional()
  }),
  KMeans: Joi.object({
    k_clusters: Joi.number().min(2),
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
  const errors = error?.details.reduce((acc, currentError) => (
    merge(acc, createError(currentError.message, currentError.path.map(p => p.toString())))
  ), {}) || {}
  return {
    values,
    errors,
  }
}

export interface INgramFormParams {
  token_set: 'modified' | 'keywords'
  min_ngrams: number
  max_ngrams: number
  svd_n_components: number
  random_seed?: number
  selected_clustering_algo: ClusteringAlgoType
  // This Required-Omit hack omits the name, and makes all the properties defined.
  // Otherwise the errors-object won't infer the maybe values eg. eps?: number
  DBSCAN: Required<Omit<IDBSCANParams, 'name'>>
  HDBSCAN: Required<Omit<IHDBSCANParams, 'name'>>
  OPTICS: Required<Omit<IOPTICSParams, 'name'>>
  KMeans: Required<Omit<IKMeansParams, 'name'>>
  // dim_visualization_params?: DimVisualization
}
interface IProps {
  className?: string
  visible: boolean
  initialData?: Partial<INgramParams>
  onUpdate?: (data: INgramParams) => void
  onSubmit?: (data: INgramParams) => Promise<any | undefined>
  onCancel?: () => void
}

const NgramParametersFormEl = inject((stores: Stores) => ({
  initialData: stores.modelStore.modelParameters[NgramModelId],
  onSubmit: (data: INgramParams) => stores.modelStore.runModel(data)
}))
(observer((props: IProps) => {
  const { className, initialData, onSubmit, onCancel, visible } = props
  const methods = useForm<INgramFormParams>({
    validationResolver: resolver,
    defaultValues: {
      svd_n_components: initialData?.svd_n_components || 40,
      random_seed: initialData?.random_seed || -1,
      min_ngrams: initialData?.ngrams && initialData.ngrams[0] || 5,
      max_ngrams: initialData?.ngrams && initialData.ngrams[1] || 5,
      selected_clustering_algo: initialData?.clustering_params?.name || 'DBSCAN',
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
    }
  })
  const { register, errors, reset, handleSubmit } = methods
  const [tokenSet, setTokenSet] = useState<TokenSetType>(DEFAULT_TOKEN_SET)
  const [submitInProgress, setSubmitInProgress] = useState(false)

  function handleTokenSetChange(o: TokenSetOption) {
    setTokenSet(o.key)
  }
  const onFormSubmit = async (data: INgramFormParams, e?: React.BaseSyntheticEvent) => {
    setSubmitInProgress(true)

    const {
      min_ngrams, max_ngrams, svd_n_components, random_seed, selected_clustering_algo
    } = data

    const payload = {
      model_id: NgramModelId,
      token_set: tokenSet,
      ngrams: [min_ngrams, max_ngrams] as [number, number],
      svd_n_components: svd_n_components,
      clustering_params: {
        name: selected_clustering_algo,
        ...data[selected_clustering_algo]
      },
      // dim_visualization_params?: DimVisualization
      // random_seed: parseInt(random_seed),
    }
    onSubmit!(payload).then(result => {
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
        <FormField>
          <label htmlFor="svd_n_components">SVD n-components</label>
          <Input
            type="number"
            name="svd_n_components"
            id="svd_n_components"
            ref={register}/>
            <Error>
              {errors.svd_n_components && 'At least 30 is recommended'}
            </Error>
        </FormField>
      </TopRow>
      <MiddleRow>
        <SelectClusteringAlgo />
      </MiddleRow>
      <Buttons>
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
      </Buttons>
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
