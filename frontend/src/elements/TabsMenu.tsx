import React, { memo } from 'react'
import styled from '../theme/styled'

interface IOption {
  key: string
  value: string
  itemCount?: number
  disabled?: boolean
}
interface IProps {
  className?: string
  options: IOption[]
  selected: IOption
  onSelect: (option: IOption) => void
}

const TabsMenuEl = memo((props: IProps) => {
  const { className, options, selected, onSelect } = props
  function renderItemCount(option: IOption) {
    if (option.itemCount && !option.disabled) {
      return (
        <ItemsCountWrapper>
          <ItemsCount>{option.itemCount}</ItemsCount>
        </ItemsCountWrapper>
      )
    }
    return undefined
  }
  return (
    <Container className={className}>
      <TabList>
        { options.map(o =>
        <TabListItem key={o.key} selected={selected.key === o.key} disabled={o.disabled}>
          <TabButton disabled={o.disabled} onClick={() => onSelect(o)}>{o.value}</TabButton>
          { renderItemCount(o) }
        </TabListItem>
        )}
      </TabList>
    </Container>
  )
})

const Container = styled.div`
`
const TabList = styled.ul`
  border-bottom: 1px solid ${({ theme }) => theme.color.gray.lighter};
  display: flex;
  list-style: none;
  margin: 0 15px;
  padding: 0;
`
const TabListItem = styled.li<{ disabled?: boolean, selected: boolean }>`
  border-bottom: 2px solid ${({ selected, theme }) => selected ? theme.color.blue : 'transparent'};
  color: ${({ selected, theme }) => selected ? theme.color.textDark : theme.color.textLight};
  display: flex;
  font-weight: ${({ selected }) => selected ? 'bold' : 400};
  margin-right: 15px;
  padding: 10px 0 5px 0;
  &:hover {
    border-color: ${({ disabled, theme }) => !disabled && theme.color.blue};
    color: ${({ disabled, theme }) => !disabled && theme.color.textDark};
    font-weight: ${({ disabled }) => !disabled && 'bold'};
  }
`
const TabButton = styled.button<{ disabled?: boolean }>`
  background: transparent;
  border: 0;
  cursor: ${({ disabled }) => disabled ? 'cursor' : 'pointer'};
  font-size: 14px;
  padding: 0;
  text-transform: uppercase;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.gray.base};
    outline-style: dotted;
    outline-offset: 2px;
  }
`
const ItemsCountWrapper = styled.span`
  align-items: center;
  background: ${({ theme }) => theme.color.primary};
  border-radius: 100%;
  color: #fff;
  display: inline-flex;
  margin-left: 8px;
  justify-content: center;
  padding: 0 2px 2px 2px;
  position: relative;
  top: -2px;
  height: 30px;
  width: 30px;
`
const ItemsCount = styled.small`
`

export const TabsMenu = styled(TabsMenuEl)``
