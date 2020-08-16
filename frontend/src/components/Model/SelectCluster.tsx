import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { Button } from '../../elements/Button'
import { Icon } from '../../elements/Icon'

import { Stores } from '../../stores'

interface IProps {
  className?: string
  activeCluster?: string | null
  currentClusters?: { [id: string]: string[] }
  setActiveCluster?: (cluster: string) => void
  resetActiveCluster?: () => void
}

const SelectClusterEl = inject((stores: Stores) => ({
  activeCluster: stores.clustersStore.activeCluster,
  currentClusters: stores.clustersStore.currentClusters,
  setActiveCluster: stores.clustersStore.setActiveCluster,
  resetActiveCluster: stores.clustersStore.resetActiveCluster,
}))
(observer((props: IProps) => {
  const {
    className, activeCluster, currentClusters, setActiveCluster, resetActiveCluster
  } = props
  const clusterKeys = Object.keys(currentClusters!)

  function handleClickIcon(direction: 'left' | 'right') {
    if (activeCluster === null) return
    const currentIndex = clusterKeys.indexOf(activeCluster!)
    if (direction === 'left' && clusterKeys.length > 0 && currentIndex !== 0) {
      setActiveCluster!(clusterKeys[currentIndex - 1])
    } else if (direction === 'right' && clusterKeys.length > 0 && currentIndex !== clusterKeys.length - 1) {
      setActiveCluster!(clusterKeys[currentIndex + 1])
    }
  }
  function handleClickCluster(cluster: string) {
    setActiveCluster!(cluster)
  }
  function handleResetActiveCluster() {
    resetActiveCluster!()
  }
  return (
    <Container className={className} >
      <SearchHeader>
        <Title>Select cluster</Title>
        <ParamsHeaderButtons>
          <Button intent="transparent" onClick={handleResetActiveCluster}>Reset</Button>
        </ParamsHeaderButtons>
      </SearchHeader>
      <Body>
        <Icon button onClick={() => handleClickIcon('left')}><FiChevronLeft size={20}/></Icon>
        <ClustersList>
          { clusterKeys.map((c, i) =>
          <ClusterItem key={`${c}-${i}`}>
            <ClusterButton selected={activeCluster === c} onClick={() => handleClickCluster(c)}>
              <span className="cluster">{c}</span>
              [<span className="count">{currentClusters![c].length}</span>]
            </ClusterButton>
          </ClusterItem>
          )}
        </ClustersList>
        <Icon button onClick={() => handleClickIcon('right')}><FiChevronRight size={20}/></Icon>
      </Body>
    </Container>
  )
}))

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  width: 100%;
`
const SearchHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 1rem 0;
  & > *:first-child {
    margin: 0 2rem 0 0;
  }
`
const ParamsHeaderButtons = styled.div`
  align-items: center;
  display: flex;
  & > * + * {
    margin-left: 1rem;
  }
`
const Title = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
`
const Body = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`
const ClustersList = styled.ol`
  align-items: center;
  display: flex;
  margin: 0 8px;
  & > * + * {
    margin-left: 8px;
  }
`
const ClusterItem = styled.li`
`
const ClusterButton = styled.button<{ selected: boolean }>`
  align-items: center;
  background: ${({ theme, selected }) => selected ? theme.color.primary : '#fff'};
  border: 0;
  border-radius: 2px;
  color: #222;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  padding: 0.5rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background: ${({ theme, selected }) => selected ? theme.color.primary : '#bbb'};
  }
  & > .cluster {
    font-weight: bold;
    margin-right: 0.5rem;
  }
  & > .count {
    font-size: 0.8rem;
  }
`

export const SelectCluster = styled(SelectClusterEl)``
