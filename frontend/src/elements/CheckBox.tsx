import React, { forwardRef } from 'react'
import styled from '../theme/styled'

interface IProps {
  className?: string
  id?: string
  name?: string
  type?: 'checkbox' | 'toggle'
  checked?: boolean
  disabled?: boolean
  required?: boolean
  onChange?: (val: boolean) => void
}

const CheckBoxEl = forwardRef((props: IProps, ref?: any) => {
  const { className, id, name, checked, disabled, required, type = 'checkbox', onChange } = props
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    !disabled && onChange && onChange(event.target.checked)
  }
  return (
    <Wrapper className={`${className} ${type}`}>
      <input
        ref={ref}
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        required={required}
        onChange={handleChange}
      />
      { type === 'toggle' && <Slider className="slider"></Slider> }
      { type === 'checkbox' && <CheckMark className="checkmark" ></CheckMark>}
    </Wrapper>
  )
})

const CheckMark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #ddd;
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
const Slider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: .4s;
  &:before {
    position: absolute;
    content: "";
    border-radius: 50%;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
  }
`
const Wrapper = styled.label`
  &.toggle {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 26px;
    & > input {
      opacity: 0;
      width: 0;
      height: 0;
      &:checked + ${Slider} {
        background-color: #2196F3;
      }
      &:focus + ${Slider} {
        box-shadow: 0 0 1px #2196F3;
      }
      &:checked + ${Slider}:before {
        transform: translateX(70%);
      }
    }
  }
  &.checkbox {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    user-select: none;
    &:hover input ~ ${CheckMark} {
      background-color: #bbb;
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
  }
`

export const CheckBox = styled(CheckBoxEl)``
