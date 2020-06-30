import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { IReviewWithSelection } from 'shared'
import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IProps {
  className?: string
  modal?: IModal
  closeModal?: (modal: EModal) => void
}

function createCodeHTML(code: string, selection: [number, number, number]) {
  return `${code.substring(0, selection[1])}<mark>${code.substring(selection[1], selection[2])}</mark>${code.substring(selection[2])}`
}

export const SubmissionReviewsModal = inject((stores: Stores) => ({
  modal: stores.modalStore.modals[EModal.SUBMISSION_REVIEWS],
  closeModal: stores.modalStore.closeModal,
}))
(observer((props: IProps) => {
  const { className, modal, closeModal } = props
  const [shownReviewIdx, setShownReviewIdx] = useState(-1)
  const [editingReviewSelection, setEditingReviewSelection] = useState(false)
  const [codeHTML, setCodeHTML] = useState(modal!.params.submission?.code)

  useEffect(() => {
    setCodeHTML(modal!.params.submission?.code)
  }, [modal!.params])

  function handleReviewHover(idx: number) {
    if (shownReviewIdx !== idx && !editingReviewSelection) {
      setShownReviewIdx(idx)
      setCodeHTML(createCodeHTML(modal!.params?.submission?.code, modal!.params?.reviews[idx]?.selection))
    }
  }
  function handleReviewClick(idx: number) {
    if (shownReviewIdx !== idx || !editingReviewSelection) {
      setShownReviewIdx(idx)
      setCodeHTML(createCodeHTML(modal!.params?.submission?.code, modal!.params?.reviews[idx]?.selection))
      setEditingReviewSelection(true)
    } else {
      setShownReviewIdx(-1)
      setCodeHTML(modal!.params.submission?.code)
      setEditingReviewSelection(!editingReviewSelection)
    }
  }
  function handleClose() {
    closeModal!(EModal.SUBMISSION_REVIEWS)
    setShownReviewIdx(-1)
    setEditingReviewSelection(false)
  }
  async function handleEditReviewSelectionSubmit(payload: any, onSuccess: () => void, onError: () => void) {
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
            <TitleWrapper><h2>Submission reviews</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <Content>
            <Code dangerouslySetInnerHTML={{__html: codeHTML }} />
            <ReviewsListUl>
              { modal!.params?.reviews.map((review: IReviewWithSelection, i: number) =>
              <ReviewItem
                key={`r-${review.review_id}`}
                active={i === shownReviewIdx}
                onClick={() => handleReviewClick(i)}
                onMouseOver={() => handleReviewHover(i)}
                tabIndex={0}
              >
                <TextBox>
                  <label>Message</label>
                  <ReviewMessage>{review.message}</ReviewMessage>
                </TextBox>
                { review.metadata && <TextBox>
                  <label>Metadata</label>
                  <ReviewMetadata>{review.metadata}</ReviewMetadata>
                </TextBox>}
              </ReviewItem>
              )}
            </ReviewsListUl>
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
  max-width: 1200px;
  padding: 20px;
  text-align: center;
  width: calc(100% - 20px - 2rem);
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    max-width: 600px;
  }
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
    font-weight: 500;
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
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    flex-direction: row;
    & > *:first-child {
      margin-right: 1rem;
    }
  }
`
const ReviewsListUl = styled.ol`
  max-width: 600px;
  overflow-y: scroll;
  list-style: decimal;
  padding: 0.5rem;
  width: 100%;
  & > * + * {
    margin: 10px 0 0 0;
  }
`
const ReviewItem = styled.li<{ active: boolean}>`
  background: ${({ active, theme }) => active ? 'rgba(0,0,0,0.08)' : theme.color.white};
  border-radius: 0.25rem;
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  text-align: left;
  &:hover {
    background: ${({ theme }) => 'rgba(0,0,0,0.08)'};
  }
`
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  &:not(:first-child) {
    margin-top: 0;
  }
`
const ReviewMessage = styled.p`
  background: #fff;
  border: 1px solid #222;
  border-radius: 4px;
  margin: 0;
  padding: 0.5rem;
`
const ReviewMetadata = styled.p`
  background: #fff;
  border: 1px solid #222;
  border-radius: 4px;
  margin: 0;
  padding: 0.5rem;
`
const Buttons = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  & > *:first-child {
    margin-right: 1rem;
  }
`
const Code = styled.pre`
  background: #222;
  color: #fff;
  padding: 10px;
  border-radius: 0.25rem;
  margin: 0;
  max-width: 600px;
  overflow: scroll;
  text-align: left;
  width: 100%;
`
