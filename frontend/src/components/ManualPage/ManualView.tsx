import React from 'react'
import styled from 'styled-components'

interface IProps {
  className?: string
}

function ManualViewEl(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <Header>
        <h1>Manual</h1>
        <Info>
          <InfoText>
            This page describes the main functionalities of CodeClusters and how it can be used.
          </InfoText>
          <p>
            
          </p>
        </Info>
        <h2>Premise</h2>
        <p>
          In CodeClusters the goal is to enable teachers to explore and cluster student code with ease and allow sending of
          reviews to students to give them suitable feedback. The submitted code should be ingested by CodeClusters and then
          processed by storing them to Postgres and indexing them to Solr. Solr is a search library which allows more intricate
          search operations than Postgres's own text-search. To Solr then are stored the code alongside any calculated metrics
          and metadata. The frontpage's search box then allows the querying and filtering of this data.
        </p>
        <h2>Search</h2>
        <p>
          To go into further detail what the search is and why it works like it does. Search is intended for quick ad-hoc
          exploration of the data with easy way of filtering. The way it was implemented allows the searching of the whole
          data-set yet it's unclear what are the constraints for doing so. The performance will definitely deteriorate with
          larger dataset.
        </p>
        <h2>Modeling</h2>
        <p>
          Search result can be automatically clustered by the available models as implemented in CodeClustersModeling repository.
          While the clustering does not arguably yield always very actionable results, it can be a quick way to subset the data
          into easily digestible buckets to which teacher can easily give review to. 
        </p>
        <h2>Reviewing</h2>
        <p>
          After either searching or modeling submissions, reviews can be added to the selected submissions. This can be done
          be either clicking the submission or using the small review menu at the bottom right corner of the screen. After
          the wanted submissions are selected, teacher can write a review with an optional metadata hidden from the students
          and tags. After review is created it is not immediately sent to the students but it has the accepted from the /review
          page. There you are able to see all the pending and sent reviews in a neat grid, and do some modifications to the reviews.
        </p>
        <h2>Review flows</h2>
        <p>
          Since CodeClusters is a prototype project in an attempt to automatize reviewing of large-scale student submissions in
          MOOCs, it allows a primitive way of storing reviews with given search or model as review flows. Review flows execute
          the described normal search query with given parameters, and then allows some modeling based on those search results.
          After review flow is run, it pre-fills the review form fields with provided values.
        </p>
        <p></p>
        <p>
          CodeCluste
        </p>
      </Header>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > * + * {
    margin: 2rem 0;
  }
`
const Header = styled.header`
  display: flex;
  flex-direction: column;
`
const Info = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`
const InfoText = styled.p`
  margin: 0;
`
const MainInputs = styled.div`
  width: 100%;
  > * + * {
    margin: 1rem 0;
  }
`

export const ManualView = styled(ManualViewEl)``
