import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { Button } from '../../elements/Button'

import { IReview } from '@codeclusters/types'
import { Stores } from '../../stores/Stores'
import { EModal } from '../../stores/ModalStore'

interface IProps {
  className?: string
  reviews?: IReview[]
  acceptPendingReviews?: (reviewIds: number[]) => Promise<any>
  openModal?: (modal: EModal, params: any) => void
}

const ReviewSubmissionsControlsEl = inject((stores: Stores) => ({
  reviews: stores.reviewStore.reviews,
  acceptPendingReviews: stores.reviewStore.acceptPendingReviews,
  openModal: stores.modalStore.openModal,
}))(
  observer((props: IProps) => {
    const { className, reviews, acceptPendingReviews, openModal } = props
    function handleClickAcceptAll() {
      acceptPendingReviews!(reviews!.map((r) => r.review_id))
    }
    function handleClickDeleteAll() {
      openModal!(EModal.DELETE_REVIEWS, {
        submit: () => Promise.resolve(),
        count: reviews!.length,
      })
    }
    return (
      <Container className={className}>
        <Button intent="success" onClick={handleClickAcceptAll}>
          Accept all
        </Button>
        <Button intent="danger" onClick={handleClickDeleteAll}>
          Delete all
        </Button>
      </Container>
    )
  })
)

const Container = styled.div`
  display: flex;
  & > * + * {
    margin-left: 1rem;
  }
`

export const ReviewSubmissionsControls = styled(ReviewSubmissionsControlsEl)``
