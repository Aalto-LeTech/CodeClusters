import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiXOctagon, FiX } from 'react-icons/fi'

import { ToastStore } from '../stores/ToastStore'
import { ITheme } from '../types/theme'
import { IToast } from '../types/ui'

interface IToastProps {
  className?: string
  toast: IToast
  removeToast: (id: number) => void
}
const Toast = memo((props: IToastProps) => {
  const { className, toast, removeToast } = props
  const [inProgress, setInProgress] = useState(false)
  const remove = useCallback(() => removeToast(toast.id), [toast])
  useLayoutEffect(() => {
    const id = setTimeout(() => setInProgress(true), 0)
    return () => clearTimeout(id)
  }, [])
  useLayoutEffect(() => {
    const id = setTimeout(remove, toast.duration)
    return () => clearTimeout(id)
  }, [])
  return (
    <ToastItem className={className} type={toast.type}>
      <ToastBody type={toast.type}>
        <SvgWrapper className="type-icon">{getTypeIcon(toast.type)}</SvgWrapper>
        <p className="message">{toast.message}</p>
        <SvgAction className="close-icon">
          <FiX size={24} onClick={remove} />
        </SvgAction>
      </ToastBody>
      <Progress type={toast.type} duration={toast.duration} inProgress={inProgress} />
    </ToastItem>
  )
})

interface IProps {
  className?: string
  toastStore?: ToastStore
}
export const Toaster = inject('toastStore')(
  observer((props: IProps) => {
    const { className, toastStore } = props
    return (
      <ToastsList className={`${className} ${toastStore!.toasterLocation}`}>
        {toastStore!.toasts.map((t) => (
          <Toast key={t.id} toast={t} removeToast={toastStore!.removeToast} />
        ))}
      </ToastsList>
    )
  })
)

function getTypeIcon(type: string, size: number = 24) {
  switch (type) {
    case 'info':
      return <FiAlertCircle size={size} />
    case 'warning':
      return <FiAlertTriangle size={size} />
    case 'danger':
      return <FiXOctagon size={size} />
    case 'success':
    default:
      return <FiCheckCircle size={size} />
  }
}

function getTypeColor(type: string, theme: ITheme) {
  switch (type) {
    case 'info':
      return theme.color.blue
    case 'warning':
      return theme.color.orange
    case 'danger':
      return theme.color.red
    case 'success':
    default:
      return theme.color.green
  }
}

const SvgWrapper = styled.span`
  display: flex;
`
const SvgAction = styled.button`
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  padding: 8px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`
const ToastsList = styled.ul`
  align-items: start;
  display: flex;
  flex-direction: column-reverse;
  list-style: none;
  max-width: 600px;
  padding: 0;
  position: fixed;
  width: 50vw;
  z-index: 1000;
  &.bottom-left {
    bottom: 20px;
    left: 20px;
  }
  &.top-right {
    top: 20px;
    right: 20px;
  }
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.TABLET_WIDTH}) {
    &.bottom-left {
      bottom: 0;
      left: 0;
    }
    &.top-right {
      top: 0;
      right: 0;
    }
  }
  & > li:not(:last-child) {
    margin-top: 10px;
  }
`
type ToastItemProps = {
  type: string
}
const ToastItem = styled.li<ToastItemProps>`
  display: flex;
  background: #fff;
  border: 1px solid ${({ type, theme }) => getTypeColor(type, theme)};
  border-left: 4px solid ${({ type, theme }) => getTypeColor(type, theme)};
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.18);
  flex-direction: column;
  justify-content: space-between;
  min-width: 300px;
  max-width: 600px;
  padding: 5px 5px 0 0;
  width: 100%;
`
type ToastBodyProps = { type: string }
const ToastBody = styled.div<ToastBodyProps>`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 4px 0 4px 0;
  .type-icon {
    color: ${({ type, theme }) => getTypeColor(type, theme)};
    margin: 0 15px 0 15px;
  }
  .message {
    color: ${({ type, theme }) => getTypeColor(type, theme)};
    font-size: ${({ theme }) => theme.fontSize.medium};
    font-style: bold;
    margin: 10px 0 10px 0;
  }
  .remove-icon {
    color: ${({ theme }) => theme.color.textDark};
    cursor: pointer;
    margin-right: 3px;
  }
`
type ProgressProps = { type: string; inProgress: boolean; duration: number }
const Progress = styled.div<ProgressProps>`
  background: ${({ type, theme }) => getTypeColor(type, theme)};
  height: 4px;
  width: ${({ inProgress }) => (inProgress ? '0%' : '100%')};
  transition: width ${({ duration }) => duration}ms linear 0ms;
`
