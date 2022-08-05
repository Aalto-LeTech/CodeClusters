import { RefObject, useEffect, useState } from 'react'

const useHover = (
  ref: RefObject<HTMLElement | null>,
  onHover: (event: MouseEvent) => void,
  isActive: boolean
) => {
  const [isListening, setListening] = useState(false)

  function addHandlers(el: HTMLElement) {
    el.addEventListener('mouseover', onHover)
  }
  function removeHandlers(el: HTMLElement) {
    el.removeEventListener('mouseover', onHover)
  }
  useEffect(() => {
    if (!isListening && isActive && ref.current) {
      addHandlers(ref.current)
      setListening(true)
    } else if (isListening && !isActive && ref.current) {
      removeHandlers(ref.current)
      setListening(false)
    }
    return () => {
      ref.current && removeHandlers(ref.current)
    }
  }, [ref, !onHover, isActive])
}

export default useHover
