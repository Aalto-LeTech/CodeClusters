import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { withRouter, RouteComponentProps } from 'react-router'
import { createSearchQueryParams, parseSearchQueryParams } from '../../utils/url'

import { SearchForm } from './SearchForm'

import { Stores } from '../../stores'
import { ISearchCodeParams, ISolrSearchCodeResponse } from 'shared'

interface IProps extends RouteComponentProps {
  className?: string
  visible: boolean
  courseId?: number
  exerciseId?: number
  searchParams?: ISearchCodeParams
  initialSearchParams?: ISearchCodeParams
  setInitialSearchParams?: (payload: ISearchCodeParams) => void
  search?: (payload: ISearchCodeParams) => Promise<ISolrSearchCodeResponse | undefined>
  deactivateLocalSearch?: () => void
}

const SearchConsoleEl = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  searchParams: stores.searchStore.searchParams,
  initialSearchParams: stores.searchStore.initialSearchParams,
  setInitialSearchParams: stores.searchStore.setInitialSearchParams,
  search: stores.searchStore.search,
  deactivateLocalSearch: () => stores.localSearchStore.setActive(false),
}))
(observer(withRouter((props: IProps) => {
  const {
    className, history, setInitialSearchParams, search, deactivateLocalSearch, initialSearchParams,
    searchParams, courseId, exerciseId, visible
  } = props
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const current = createSearchQueryParams(searchParams!)
    if (history.location.search !== current && !mounted) {
      const searchQuery = parseSearchQueryParams(history.location.search)
      if (searchQuery) {
        setInitialSearchParams!(searchQuery)
      }
    } else {
      history.push(current)
    }
    setMounted(true)
  }, [searchParams])

  function handleChange() {
    deactivateLocalSearch!()
  }
  function handleSearch(payload: ISearchCodeParams) {
    history.push(createSearchQueryParams(payload))
    return search!(payload)
  }
  return (
    <Container className={className} visible={visible}>
      <SearchForm
        id="main_search"
        courseId={courseId}
        exerciseId={exerciseId}
        defaultSearchParams={initialSearchParams}
        onChange={handleChange}
        onSearch={handleSearch}
      />
    </Container>
  )
})))

const Container = styled.section<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'block' : 'none'};
  visibility: ${({ visible }) => visible ? 'initial' : 'hidden'};
`
export const SearchConsole = styled(SearchConsoleEl)``
