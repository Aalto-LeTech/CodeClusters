import React, { memo, useMemo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { MdKeyboardArrowRight } from 'react-icons/md'
import { FiChevronDown, FiChevronUp, FiTrash } from 'react-icons/fi'

import { Button } from '../../elements/Button'
import { Icon } from '../../elements/Icon'

import { NgramParametersForm } from './NgramParametersForm'

import { ModelStore } from '../../stores/ModelStore'

interface IProps {
  className?: string
  modelStore?: ModelStore
}

const ModelParametersEl = inject('modelStore')(observer((props: IProps) => {
  const { className, modelStore } = props
  const [minimized, setMinimized] = useState(true)

  function handleClickToggle() {
    setMinimized(!minimized)
  }
  return (
    <Container className={className}>
      <Header>
        <Button onClick={handleClickToggle} intent="success" disabled={modelStore!.selectedModel === undefined}>
          <Icon><MdKeyboardArrowRight size={24}/></Icon>
          <Title>{`${minimized ? 'Set' : 'Hide'} model parameters`}</Title>
        </Button>
        <Icon button onClick={handleClickToggle} disabled={modelStore!.selectedModel === undefined}>
          { minimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
        </Icon>
      </Header>
      <Body minimized={minimized}>
        <h2>{modelStore!.selectedModel?.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: modelStore!.selectedModel?.description || '' }} />
        <NgramParametersForm visible={modelStore!.selectedModel?.model_id === 'ngram'}/>
      </Body>
    </Container>
  )
}))

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  margin-top: 0.75rem;
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  max-width: 700px;
  width: 100%;
  & > ${Button} {
    padding: 0.5rem 0.75rem 0.5rem 1rem;
  }
`
const Title = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0 1rem;
`
const Body = styled.div<{ minimized: boolean}>`
  background: #ededed;
  border-radius: 4px;
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: space-around;
  margin-top: 0.75rem;
  max-width: 700px;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
`

export const ModelParameters = styled(ModelParametersEl)``
