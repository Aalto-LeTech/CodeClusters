import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { MdKeyboardArrowRight } from 'react-icons/md'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

import { Button } from '../../elements/Button'
import { Icon } from '../../elements/Icon'

import { IModel } from 'shared'

interface IProps {
  className?: string
  selectedModel?: IModel
}

const ModelDescriptionEl = observer((props: IProps) => {
  const { className, selectedModel } = props
  const [minimized, setMinimized] = useState(true)

  function handleClickToggle() {
    setMinimized(!minimized)
  }
  return (
    <Container className={className}>
      <Header>
        <Button onClick={handleClickToggle} intent="success" disabled={selectedModel === undefined}>
          <Icon><MdKeyboardArrowRight size={24}/></Icon>
          <Title>{`${minimized ? 'Show' : 'Hide'} model description`}</Title>
        </Button>
        <Icon button onClick={handleClickToggle} disabled={selectedModel === undefined}>
          { minimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
        </Icon>
      </Header>
      <Body minimized={minimized}>
        <h2>{selectedModel?.title}</h2>
        <Description>{selectedModel?.description}</Description>
      </Body>
    </Container>
  )
})

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
  line-height: 1.1;
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
const Description = styled.p`
  white-space: pre-wrap;
`

export const ModelDescription = styled(ModelDescriptionEl)``
