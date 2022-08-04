import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { FormContext, useForm } from 'react-hook-form'
import Joi from 'joi'
import merge from 'lodash.merge'

import { SelectClusteringAlgo } from './SelectClusteringAlgo'
import { SelectDimVisualization } from './SelectDimVisualization'
import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import {
  INgramParams, TokenSetType, NgramModelId,
} from '@codeclusters/types'
import { INgramFormParams } from '../../types/forms'

type TokenSetOption = { key: TokenSetType, value: string }

const TOKEN_SET_OPTIONS = [
  { key: 'modified', value: 'modified' },
  { key: 'complete', value: 'complete' },
  { key: 'keywords', value: 'keywords' }
] as TokenSetOption[]
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
  token_set: Joi.string().valid('modified', 'complete', 'keywords'),
  min_ngrams: Joi.number().integer().min(1).max(20),
  max_ngrams: Joi.number().integer().min(Joi.ref('min_ngrams')).max(20),
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

function generateDefaultData(initialData?: INgramParams) {
  return ({
    token_set: initialData?.token_set || 'modified',
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
  })
}

interface IProps {
  className?: string
  id: string
  visible: boolean
  initialData?: INgramParams
  onSubmit?: (data: INgramParams) => Promise<any>
  onChange?: (formData: INgramFormParams) => void
  onCancel: () => void
}

const NgramParametersFormEl = observer(forwardRef((props: IProps, ref) => {
  const { className, id, visible, initialData, onSubmit, onChange, onCancel } = props
  const methods = useForm<INgramFormParams>({
    validationResolver: resolver,
    defaultValues: generateDefaultData(initialData),
  })
  const { register, reset, errors, watch, getValues, handleSubmit } = methods
  const [tokenSet, setTokenSet] = useState<TokenSetType>(getValues('token_set'))
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const watchAllFields = watch()
  const tokenSetChanged = watch('token_set')

  useEffect(() => {
    if (onChange) {
      onChange(getValues() as unknown as INgramFormParams)
    }
  }, [watchAllFields])
  useEffect(() => {
    setTokenSet(getValues('token_set'))
  }, [tokenSetChanged])

  // This kludge is for programmatically triggering submit from the CreateReviewFlowModal of the form.
  // This way the data is validated and parsed using the Joi schema (and transformed with normalizeFormData)
  // Other ways would have been even more annoying, this will do for now
  useImperativeHandle(ref, () => ({
    executeSubmit: () => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject('NgramParametersForm'), 500)
      handleSubmit((data: INgramFormParams, e?: React.BaseSyntheticEvent) => {
        clearTimeout(timeout)
        resolve(normalizeFormData(data))
      })()
    }),
    reset: (formData?: any) => {
      if (formData) {
        reset(formData)
      } else {
        reset(generateDefaultData(initialData))
      }
    },
  }), [])

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
    onSubmit!(normalizeFormData(data)).finally(() => {
      setSubmitInProgress(false)
    })
  }
  function handleCancel() {
    setSubmitInProgress(false)
    onCancel()
  }
  return (
    <FormContext {...methods}>
      <Form className={className} id={`${id}_ngram_parameters`} visible={visible} onSubmit={handleSubmit(onFormSubmit)}>
        <TopRow>
          <FormField>
            <label htmlFor={`${id}_ngram_token_set`}>Token set</label>
            <TokenSetDropdown
              id={`${id}_ngram_token_set`}
              selected={tokenSet}
              options={TOKEN_SET_OPTIONS}
              onSelect={handleTokenSetChange}
            />
            <input
              type="hidden"
              name="token_set"
              ref={register}
            />
          </FormField>
          <FormField>
            <label>N-grams</label>
            <MinMaxGram>
              <Input
                name="min_ngrams"
                type="number"
                placeholder="Min n"
                fullWidth
                ref={register}/>
              <Input
                name="max_ngrams"
                type="number"
                placeholder="Max n"
                fullWidth
                ref={register}/>
            </MinMaxGram>
            <Error>
              {errors.min_ngrams && 'Min n-gram must be 1-20'}
            </Error>
            <Error>
              {errors.max_ngrams && 'Max n-gram must be 1-20 and higher or equal to min n-gram'}
            </Error>
          </FormField>
          <FormField className="random_seed">
            <label htmlFor={`${id}_ngram_random_seed`}>Random seed</label>
            <Input
              id={`${id}_ngram_random_seed`}
              type="number"
              name="random_seed"
              fullWidth
              ref={register}/>
            <Error>
              {errors.random_seed && '-1 or empty for no seed, otherwise >=0'}
            </Error>
          </FormField>
        </TopRow>
        <MiddleRow>
          <SelectClusteringAlgo id={id}/>
          <SelectDimVisualization id={id}/>
        </MiddleRow>
        { onSubmit && <Buttons>
          <Button
            type="submit"
            intent="success"
            disabled={submitInProgress}
            loading={submitInProgress}
          >Run n-gram</Button>
          <Button
            intent="transparent"
            onClick={handleCancel}
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
