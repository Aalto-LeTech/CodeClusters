import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'
import { GenericDropdown } from '../../elements/Dropdown'

import { IRunNgramParams, IRunNgramResponse, NgramModelId } from 'shared'
import { Stores } from '../../stores'

interface IProps {
  className?: string
  data?: Partial<IRunNgramParams>
  onUpdate?: (data: Partial<IRunNgramParams>) => void
  onSubmit?: () => Promise<IRunNgramResponse | undefined>
  visible: boolean
}

type TokenSetType = 'modified' | 'keywords'
const TOKEN_SET_OPTIONS = [
  { key: 'modified', value: 'modified'},
  { key: 'keywords', value: 'keywords' }
] as { key: TokenSetType, value: string }[]
const DEFAULT_TOKEN_SET = 'modified'
const DEFAULT_NGRAMS = [5, 5] as [number, number]
const DEFAULT_NCOMPONENTS = 50

const NgramParametersFormEl = inject((stores: Stores) => ({
  data: stores.modelStore.modelParameters[NgramModelId],
  onUpdate: (data: Partial<IRunNgramParams>) => stores.modelStore.updateModelParameters(NgramModelId, data),
  onSubmit: () => stores.modelStore.runModel(NgramModelId)
}))
(observer((props: IProps) => {
  const { className, data, onUpdate, onSubmit, visible } = props
  const [tokenSet, setTokenSet] = useState<TokenSetType>(DEFAULT_TOKEN_SET)
  const [ngrams, setNgrams] = useState(DEFAULT_NGRAMS)
  const [svd_n_components, setSvdNComponents] = useState(DEFAULT_NCOMPONENTS)
  const [submitInProgress, setSubmitInProgress] = useState(false)

  useEffect(() => {
    if (data && data.token_set) setTokenSet(data.token_set)
    if (data && data.ngrams) setNgrams(data.ngrams)
    if (data && data.svd_n_components) setSvdNComponents(data.svd_n_components)
  }, [])

  function hasNoError() {
    return true
  }
  function handleTokenSetChange(opt: { key: TokenSetType, value: string }) {
    setTokenSet(opt.key)
    onUpdate!({ token_set: opt.key })
  }
  function handleNgramsChange(val: string) {
    const n = parseInt(val)
    const tuple = [n, n] as [number, number]
    setNgrams(tuple)
    onUpdate!({ ngrams: tuple })
  }
  function handleNcomponentsChange(val: string) {
    const n = parseInt(val)
    setSvdNComponents(n)
    onUpdate!({ svd_n_components: n })
  }
  function handleDelete() {
    
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      setSubmitInProgress(true)
      onSubmit!().then((result) => {
        setSubmitInProgress(false)
      })
    }
  }
  return (
    <Form onSubmit={handleSubmit} className={className} visible={visible}>
      <TopRow>
        <FormField>
          <label>Token set</label>
          <TokenSetDropdown
            selected={tokenSet}
            options={TOKEN_SET_OPTIONS}
            onSelect={handleTokenSetChange}
          />
        </FormField>
        <FormField>
          <label>Ngrams</label>
          <Input
            type="number"
            value={ngrams[0]}
            onChange={handleNgramsChange}
          ></Input>
        </FormField>
        <FormField>
          <label>N components</label>
          <Input
            type="number"
            value={svd_n_components}
            onChange={handleNcomponentsChange}
          ></Input>
        </FormField>
      </TopRow>
      <Buttons>
        <Button
          type="submit"
          intent="success"
          disabled={!hasNoError() || submitInProgress}
          loading={submitInProgress}
        >Submit</Button>
        <Button
          intent="danger"
          onClick={handleDelete}
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
const Buttons = styled.div`
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`

export const NgramParametersForm = styled(NgramParametersFormEl)``
