import React, { useMemo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { Flow } from './Flow'
import { TabsMenu } from '../../elements/TabsMenu'
import { DropdownSearch } from '../../elements/DropdownSearch'
import { Button } from '../../elements/Button'

import { Stores } from '../../stores/Stores'
import { EModal } from '../../stores/ModalStore'
import { ReviewFlowStore, ReviewFlowFilterType, ITabOption } from '../../stores/ReviewFlowStore'
import { IReviewFlow } from '@codeclusters/types'

interface IProps {
  className?: string
  visible: boolean
  getCurrentFlows?: IReviewFlow[]
  getCurrentFilterOption?: ITabOption
  tabFilterOptions?: ITabOption[]
  reviewFlowStore?: ReviewFlowStore
  openModal?: (modal: EModal) => void
}

const ReviewFlowsEl = inject((stores: Stores) => ({
  getCurrentFlows: stores.reviewFlowStore.getCurrentFlows,
  getCurrentFilterOption: stores.reviewFlowStore.getCurrentFilterOption,
  tabFilterOptions: stores.reviewFlowStore.tabFilterOptions,
  reviewFlowStore: stores.reviewFlowStore,
  openModal: stores.modalStore.openModal,
}))(
  observer((props: IProps) => {
    const {
      className,
      visible,
      getCurrentFlows,
      getCurrentFilterOption,
      tabFilterOptions,
      reviewFlowStore,
      openModal,
    } = props
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const dropdownOptions = useMemo(
      () => getCurrentFlows!.map((r) => ({ key: r.title, value: r.title })),
      [getCurrentFlows]
    )
    useEffect(() => {
      setLoading(true)
      reviewFlowStore!.getReviewFlows().then((flows) => {
        setLoading(false)
        if (flows.length > 0) {
          setSearchValue(flows[0].title)
        }
      })
    }, [])

    function handleOpenCreateReviewFlowModal() {
      openModal!(EModal.CREATE_REVIEW_FLOW)
    }
    function handleSelectTabOption(o: { key: string; value: string }) {
      reviewFlowStore!.setFilteredBy(o.key as ReviewFlowFilterType)
    }
    function handleSearchChange(title: string) {
      setSearchValue(title)
    }
    function handleSelectReviewFlow(option: { key: string; value: string }) {
      reviewFlowStore!.setSelectedFlow(option.key)
    }
    return (
      <Container className={className} visible={visible}>
        <Body>
          <TabsMenu
            options={tabFilterOptions!}
            selected={getCurrentFilterOption!}
            onSelect={handleSelectTabOption}
          />
          <Controls>
            <DropdownSearch
              fullWidth
              options={dropdownOptions}
              value={searchValue}
              onChange={handleSearchChange}
              onSelect={handleSelectReviewFlow}
            />
            <Button onClick={handleOpenCreateReviewFlowModal}>New flow</Button>
          </Controls>
          <Flow />
        </Body>
      </Container>
    )
  })
)

const Container = styled.section<{ visible: boolean }>`
  align-items: center;
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-direction: column;
  visibility: ${({ visible }) => (visible ? 'initial' : 'hidden')};
`
const Controls = styled.div`
  display: flex;
  margin: 1rem 1rem 0 1rem;
  & > ${DropdownSearch} {
    margin-right: 1rem;
    width: 400px;
  }
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 0;
  max-width: 700px;
  width: 100%;
`

export const ReviewFlows = styled(ReviewFlowsEl)``
