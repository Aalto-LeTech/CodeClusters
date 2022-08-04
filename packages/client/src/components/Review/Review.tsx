import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { IReview, IReviewWithSelection } from '@codeclusters/types'

interface IProps {
  className?: string
  active?: boolean
  review: IReview | IReviewWithSelection
}

const ReviewEl = observer((props: IProps) => {
  const { className, active, review } = props
  return (
    <Container className={className} active={active}>
      <Field>
        <label>Message</label>
        <ReviewMessage>{review.message}</ReviewMessage>
      </Field>
      {review.metadata && (
        <Field>
          <label>Metadata</label>
          <ReviewMetadata>{review.metadata}</ReviewMetadata>
        </Field>
      )}
      <Field>
        <label>Tags</label>
        <Tags>
          {review.tags.map((t, i) => (
            <Tag key={`rt-${t}-${i}`}>
              <TagText>{t}</TagText>
            </Tag>
          ))}
        </Tags>
      </Field>
    </Container>
  )
})

const Container = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  text-align: left;
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
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
const Tags = styled.div`
  align-items: center;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`
const Tag = styled.div`
  align-items: center;
  box-sizing: border-box;
  border-radius: 2px;
  background-color: rgb(230, 230, 230);
  display: flex;
  justify-content: center;
  min-width: 0px;
  margin: 6px 6px 6px 0;
`
const TagText = styled.span`
  color: rgb(51, 51, 51);
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  border-radius: 2px;
  overflow: hidden;
  padding: 0.3rem 0.6rem;
`

export const Review = styled(ReviewEl)``
