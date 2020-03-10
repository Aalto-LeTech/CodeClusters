import React, { forwardRef } from 'react'
import styled from '../theme/styled'

interface IProps {
  className?: string
  checked?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  onChange?: (val: boolean) => void
}

const CheckBoxEl = forwardRef((props: IProps, ref?: any) => {
  const { className, name, checked, disabled, required, onChange } = props
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    !disabled && onChange && onChange(event.target.checked)
  }
  return (
    <Wrapper className={className}>
      <input
        ref={ref}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        required={required}
        onChange={handleChange}
      />
      <CheckMark className="checkmark" ></CheckMark>
    </Wrapper>
  )
})

const CheckMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  &:after {
    content: "";
    position: absolute;
    display: none;
  }
  &:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`
const Wrapper = styled.label`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  &:hover input ~ ${CheckMark} {
    background-color: #ccc;
  }
  & > input:checked ~ ${CheckMark}{
    background-color: #2196F3;
    &:after {
      display: block;
    }
  }
  & > input {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0!important;
    outline: 0;
    z-index: -1;
    width: 17px;
    height: 17px;
  }
`

export const CheckBox = styled(CheckBoxEl)``
