import React from 'react'
import styled from '../theme/styled'
import { FiLayers } from 'react-icons/fi'

import { Input } from '../elements/Input'
import { Icon } from '../elements/Icon'

interface IOption {
  name: string
  value: number
}
interface IProps {
  className?: string
  name: string
  placeholder: string
  icon: React.ReactNode
  options: IOption[]
}

FilterMenuEl.defaultProps = {
  options: []
}

function FilterMenuEl(props: IProps) {
  const { className, name, placeholder, icon, options } = props
  return (
    <Container className={className}>
      <Body>
        <Title>{name}</Title>
        <Input placeholder={placeholder}/>
        <OptionList>
        { options.map((option: IOption, i: number) =>
          <OptionListItem key={i}>
            <Icon>{icon}</Icon>
            <OptionName>{option.name}</OptionName>
            <OptionValue>{option.value}</OptionValue>
          </OptionListItem>
          )}
        </OptionList>
      </Body>
    </Container>
  )
}

const SearchIcon = styled(FiLayers)`
  vertical-align: middle;
`
const IconWrapper = styled.div`
  display: flex; // Center the search icon
  height: 18px;
`
const Container = styled.div``
const Body = styled.fieldset``

const Title = styled.legend``

const SearchInput = styled.input``

const OptionList = styled.ul`
  list-style: none;
  margin: 10px 0 0 0;
`
const OptionListItem = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  &:hover {
    background: #ededed;
  }
`
const OptionName = styled.div``
const OptionValue = styled.div``

export const FilterMenu = styled(FilterMenuEl)``
