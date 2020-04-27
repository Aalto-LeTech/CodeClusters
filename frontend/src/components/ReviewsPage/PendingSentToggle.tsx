import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { CheckBox } from '../../elements/CheckBox'

import { Stores } from '../../stores'
import { EReviewStatus } from 'shared'

interface IProps {
  className?: string
  fetchedReviewsStatus?: EReviewStatus
  setFetchedReviewsStatus?: (status: EReviewStatus) => void
}

const PendingSentToggleEl = inject((stores: Stores) => ({
  fetchedReviewsStatus: stores.reviewStore.fetchedReviewsStatus,
  setFetchedReviewsStatus: stores.reviewStore.setFetchedReviewsStatus
}))
(observer((props: IProps) => {
  const {
    className, fetchedReviewsStatus, setFetchedReviewsStatus
  } = props
  function handleCheckPending(val: boolean) {
    if (val) {
      setFetchedReviewsStatus!(EReviewStatus.PENDING)
    } else {
      setFetchedReviewsStatus!(EReviewStatus.SENT)
    }
  }
  return (
    <Container className={className}>
      <CheckBoxText>Show {fetchedReviewsStatus} reviews</CheckBoxText>
      <CheckBox
        id="pending"
        name="pending"
        type="toggle"
        title="Toggle SENT/PENDING"
        checked={fetchedReviewsStatus === EReviewStatus.PENDING}
        onChange={handleCheckPending}
      />
    </Container>
  )
}))

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`
const CheckBoxText = styled.label`
  align-items: center;
  background: #0094ff; // ${({ theme }) => theme.color.green};
  /* border: 1px solid #222; */
  border-radius: 4px;
  color: #fff;
  display: flex;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
`

export const PendingSentToggle = styled(PendingSentToggleEl)``
