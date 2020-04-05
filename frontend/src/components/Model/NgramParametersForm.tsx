import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { Button } from '../../elements/Button'
import { Input } from '../../elements/Input'

import { IRunNgramParams, IRunNgramResponse, NgramModelId } from 'shared'
import { Stores } from '../../stores'

interface IProps {
  className?: string
  data?: Partial<IRunNgramParams>
  onUpdate?: (data: Partial<IRunNgramParams>) => void
  onSubmit?: () => Promise<IRunNgramResponse | undefined>
  visible: boolean
}

const DEFAULT_NGRAMS = [5, 5] as [number, number]
const DEFAULT_NCOMPONENTS = 50

const NgramParametersFormEl = inject((stores: Stores) => ({
  data: stores.modelStore.modelParameters[NgramModelId],
  onUpdate: (data: Partial<IRunNgramParams>) => stores.modelStore.updateModelParameters(NgramModelId, data),
  onSubmit: () => stores.modelStore.runModel(NgramModelId)
}))
(observer((props: IProps) => {
  const { className, data, onUpdate, onSubmit, visible } = props
  const [ngrams, setNgrams] = useState(DEFAULT_NGRAMS)
  const [n_components, setNcomponents] = useState(DEFAULT_NCOMPONENTS)
  const [submitInProgress, setSubmitInProgress] = useState(false)

  useEffect(() => {
    if (data && data.ngrams) setNgrams(data.ngrams)
    if (data && data.n_components) setNcomponents(data.n_components)
  }, [])

  function hasNoError() {
    return true
  }
  function handleNgramsChange(val: number) {
    const tuple = [val, val] as [number, number]
    setNgrams(tuple)
    onUpdate!({ ngrams: tuple })
  }
  function handleNcomponentsChange(val: number) {
    setNcomponents(val)
    onUpdate!({ n_components: val })
  }
  function handleDelete() {
    
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      setSubmitInProgress(true)
      const result = await onSubmit!()
      if (result) {
        onSuccess()
      } else {
        onError()
      }
    }
  }
  function onSuccess() {
    setSubmitInProgress(false)
    setNgrams(DEFAULT_NGRAMS)
    setNcomponents(DEFAULT_NCOMPONENTS)
  }
  function onError() {
    setSubmitInProgress(false)
  }
  return (
    <Form onSubmit={handleSubmit} className={className} visible={visible}>
      <TopRow>
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
            value={n_components}
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
