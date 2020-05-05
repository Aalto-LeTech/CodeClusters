import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { useForm } from 'react-hook-form'

import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import { INgramParams, TokenSetType, NgramModelId } from 'shared'
import { Stores } from '../../stores'

type TokenSetOption = { key: TokenSetType, value: string }

const TOKEN_SET_OPTIONS = [
  { key: 'modified', value: 'modified' },
  { key: 'keywords', value: 'keywords' }
] as TokenSetOption[]
const DEFAULT_TOKEN_SET = 'modified'
const DEFAULT_MIN_NGRAMS = 5
const DEFAULT_MAX_NGRAMS = 5
const DEFAULT_SVD_N_COMPONENTS = 40
const DEFAULT_RANDOM_SEED = -1

interface INgramFormParams {
  token_set: 'modified' | 'keywords'
  min_ngrams: string
  max_ngrams: string
  svd_n_components: string
  // clustering_params?: ClusteringAlgo
  // dim_visualization_params?: DimVisualization
  random_seed?: string
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
  const { register, errors, reset, handleSubmit } = useForm<INgramFormParams>({
    defaultValues: {
      svd_n_components: (initialData && initialData.svd_n_components || DEFAULT_SVD_N_COMPONENTS).toString(),
      random_seed: (initialData && initialData.random_seed || DEFAULT_RANDOM_SEED).toString(),
      min_ngrams: (initialData && initialData.ngrams && initialData.ngrams[0] || DEFAULT_MIN_NGRAMS).toString(),
      max_ngrams: (initialData && initialData.ngrams && initialData.ngrams[1] || DEFAULT_MAX_NGRAMS).toString(),
    }
  })
  const [tokenSet, setTokenSet] = useState<TokenSetType>(DEFAULT_TOKEN_SET)
  const [submitInProgress, setSubmitInProgress] = useState(false)

  function handleTokenSetChange(o: TokenSetOption) {
    setTokenSet(o.key)
  }
  const onFormSubmit = async (data: INgramFormParams, e?: React.BaseSyntheticEvent) => {
    setSubmitInProgress(true)
    const {
      min_ngrams, max_ngrams, svd_n_components, random_seed
    } = data
    const payload = {
      model_id: NgramModelId,
      token_set: tokenSet,
      ngrams: [parseInt(min_ngrams), parseInt(max_ngrams)] as [number, number],
      svd_n_components: parseInt(svd_n_components),
      // clustering_params?: ClusteringAlgo
      // dim_visualization_params?: DimVisualization
      // random_seed: parseInt(random_seed),
    }
    onSubmit!(payload).then(result => {
      setSubmitInProgress(false)
    })
  }
  return (
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
              ref={register({
                required: true,
                min: 1,
                max: 9,
              })}/>
            <Input
              id="max_ngrams"
              name="max_ngrams"
              type="number"
              placeholder="Max n"
              fullWidth
              ref={register({
                required: true,
                min: 1,
                max: 9,
              })}/>
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
            ref={register({
              required: true,
              minLength: 1
            })}/>
            <Error>
              {errors.svd_n_components && 'Review requires message with at least 1 character.'}
            </Error>
        </FormField>
      </TopRow>
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
`
const Buttons = styled.div`
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`

export const NgramParametersForm = styled(NgramParametersFormEl)``
