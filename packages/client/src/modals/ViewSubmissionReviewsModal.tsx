import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { Modal } from '../elements/Modal'
import { Review } from '../components/Review/Review'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'
import { CodeBlock } from '../components/CodeBlock'

import { ISubmission, IReviewWithSelection } from '@codeclusters/types'
import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IProps {
  className?: string
  modal?: {
    isOpen: false,
    params: {
      submission: ISubmission,
      reviewsWithSelection: IReviewWithSelection[],
    }
  }
  closeModal?: (modal: EModal) => void
}

const EMPTY_SELECTION = [-1, -1] as [number, number]

export const SubmissionReviewsModal = inject((stores: Stores) => ({
  modal: stores.modalStore.modals[EModal.VIEW_SUBMISSION_REVIEWS],
  closeModal: stores.modalStore.closeModal,
}))
(observer((props: IProps) => {
  const { className, modal, closeModal } = props
  const [shownReviewIdx, setShownReviewIdx] = useState(-1)
  const [rawCode, setRawCode] = useState('')
  const [selection, setSelection] = useState(EMPTY_SELECTION)

  useEffect(() => {
    const s = modal!.params.submission
    if (s && s.code) {
      setRawCode(s.code)
    }
  }, [modal!.params])

  function handleReviewHover(idx: number) {
    if (shownReviewIdx !== idx) {
      setShownReviewIdx(idx)
      setSelection(modal!.params?.reviewsWithSelection[idx]?.selection)
    }
  }
  function handleReviewClick(idx: number) {
    if (shownReviewIdx !== idx) {
      setShownReviewIdx(idx)
      setSelection(modal!.params?.reviewsWithSelection[idx]?.selection)
    } else {
      setShownReviewIdx(-1)
      setSelection(EMPTY_SELECTION)
    }
  }
  function handleClose() {
    closeModal!(EModal.VIEW_SUBMISSION_REVIEWS)
    setShownReviewIdx(-1)
  }
  const ref = useRef(null)
  useClickOutside(ref, (e) => handleClose(), modal!.isOpen)
  useScrollLock(modal!.isOpen)
  return (
    <Modal className={className}
      isOpen={modal!.isOpen}
      body={
        <Body ref={ref}>
          <Header>
            <TitleWrapper><h2>View submission reviews</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <Content>
            <ReviewsListUl>
              { modal!.params?.reviewsWithSelection.map((review: IReviewWithSelection, i: number) =>
              <ReviewItem
                key={`r-${review.review_id}`}
                active={i === shownReviewIdx}
                onClick={() => handleReviewClick(i)}
                onMouseOver={() => handleReviewHover(i)}
                tabIndex={0}
              >
                <ReviewCarouselItem review={review} />
              </ReviewItem>
              )}
            </ReviewsListUl>
            <CodeBlock
              code={rawCode}
              selectionStart={selection[0]}
              selectionEnd={selection[1]}
              onSelectCode={() => undefined}
            />
          </Content>
        </Body>
      }
    ></Modal>
  )
}))

const Body = styled.div`
  align-items: center;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  max-height: 1000px;
  max-width: 700px;
  padding: 20px;
  text-align: center;
  width: calc(100% - 20px - 2rem);
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 100%;
`
const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 40px;
  width: 100%;
  & > h2 {
    font-size: 20px;
    margin: 0;
    padding: 0;
  }
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px - 2rem);
  width: 100%;
  & > *:first-child {
    margin-bottom: 1rem;
  }
`
const ReviewsListUl = styled.ul`
  display: flex;
  height: 150px;
  overflow: scroll;
  padding: 4px;
  width: 100%;
  & > * + * {
    margin: 0 0 0 0.5rem;
  }
`
const ReviewItem = styled.li<{ active: boolean }>`
  background: ${({ active, theme }) => active ? '#ff5d5d' : theme.color.white};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-width: 10rem;
  padding: 0.5rem;
  text-align: left;
  &:hover {
    background: ${({ theme }) => '#ff5d5d'};
  }
`

interface IReviewCarouselItem {
  review: IReviewWithSelection
}
function ReviewCarouselItem(props: IReviewCarouselItem) {
  const { review } = props
  return (
    <ReviewCarouselItemContainer>
      <ReviewMessage>{review.message}</ReviewMessage>
    </ReviewCarouselItemContainer>
  )
}
const ReviewCarouselItemContainer = styled.div`
  word-break: break-word;
  overflow-y: hidden;
`
const ReviewMessage = styled.p`
  background: #fff;
  border: 1px solid #222;
  border-radius: 4px;
  height: 100%;
  margin: 0;
  padding: 0.5rem;
`
