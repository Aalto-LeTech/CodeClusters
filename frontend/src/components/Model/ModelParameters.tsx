import React, { forwardRef, useState } from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { MdKeyboardArrowRight } from 'react-icons/md'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

import { Button } from '../../elements/Button'
import { Icon } from '../../elements/Icon'

import { NgramParametersForm } from './NgramParametersForm'

import {
  IModel, IModelId, IModelParams, INgramParams, NgramModelId
} from 'shared'

interface IProps {
  className?: string
  id: string
  selectedModel?: IModel
  initialModelParameters: {
    ngram: INgramParams
  }
  onModelSubmit?: (data: IModelParams) => Promise<any>
}

const ModelParametersEl = observer(forwardRef((props: IProps, ref) => {
  const { className, id, selectedModel, initialModelParameters, onModelSubmit } = props
  const [minimized, setMinimized] = useState(true)

  async function handleClickToggle() {
    setMinimized(!minimized)
  }
  return (
    <Container className={className} id={`${id}_model_parameters`}>
      <Header>
        <Button onClick={handleClickToggle} intent="success" disabled={selectedModel === undefined}>
          <Icon><MdKeyboardArrowRight size={24}/></Icon>
          <Title>{`${minimized ? 'Set' : 'Hide'} model parameters`}</Title>
        </Button>
        <Icon button onClick={handleClickToggle} disabled={selectedModel === undefined}>
          { minimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
        </Icon>
      </Header>
      { selectedModel && <Body minimized={minimized}>
        <NgramParametersForm
          ref={ref}
          id={id}
          visible={selectedModel?.model_id === NgramModelId}
          initialData={initialModelParameters![NgramModelId]}
          onSubmit={onModelSubmit}
          onCancel={() => setMinimized(true)}
        />
      </Body> }
    </Container>
  )
}))

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
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
const Title = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0 1rem;
`
const Body = styled.div<{ minimized: boolean}>`
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: space-around;
  margin-top: 0.75rem;
  max-width: 700px;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
`

export const ModelParameters = styled(ModelParametersEl)``
