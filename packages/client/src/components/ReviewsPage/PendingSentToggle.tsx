import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { CheckBox } from '../../elements/CheckBox'

import { Stores } from '../../stores/Stores'
import { IGetReviewsParams } from '../../types/forms'

interface IProps {
  className?: string
  getReviewsParams?: IGetReviewsParams
  setGetReviewsParams?: (params: Partial<IGetReviewsParams>) => void
}

const PendingSentToggleEl = inject((stores: Stores) => ({
  getReviewsParams: stores.reviewStore.getReviewsParams,
  setGetReviewsParams: stores.reviewStore.setGetReviewsParams,
}))(
  observer((props: IProps) => {
    const { className, getReviewsParams, setGetReviewsParams } = props
    function handleCheckSent(val: boolean) {
      if (getReviewsParams!.pending) {
        setGetReviewsParams!({ sent: val })
      }
    }
    function handleCheckPending(val: boolean) {
      if (getReviewsParams!.sent) {
        setGetReviewsParams!({ pending: val })
      }
    }
    return (
      <Container className={className}>
        <Row>
          <CheckBoxText>Show SENT reviews</CheckBoxText>
          <CheckBox
            id="sent"
            name="sent"
            title="Check SENT reviews"
            checked={getReviewsParams!.sent}
            onChange={handleCheckSent}
          />
        </Row>
        <Row>
          <CheckBoxText>Show PENDING reviews</CheckBoxText>
          <CheckBox
            id="pending"
            name="pending"
            title="Check PENDING reviews"
            checked={getReviewsParams!.pending}
            onChange={handleCheckPending}
          />
        </Row>
      </Container>
    )
  })
)

const Container = styled.div`
  align-items: center;
  justify-content: space-between;
`
const Row = styled.div`
  align-items: center;
  display: flex;
`
const CheckBoxText = styled.label`
  color: #222;
  font-weight: bold;
  font-size: 1rem;
  margin: 0.5rem 1rem 0.5rem 0;
`

export const PendingSentToggle = styled(PendingSentToggleEl)``
