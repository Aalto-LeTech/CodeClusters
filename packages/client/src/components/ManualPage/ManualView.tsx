import React from 'react'
import styled from 'styled-components'

interface IProps {
  className?: string
}

function ManualViewEl(props: IProps) {
  const { className } = props
  return (
    <Wrapper className={className}>
      <Container>
        <Header>
          <a href="https://github.com/Aalto-LeTech/CodeClusters" target="_blank" rel="noreferrer">
            <h1>CodeClusters</h1>
          </a>
          <p>
            CodeClusters was a thesis project originally authored by Teemu Koivisto for Aalto
            University's LeTech research group during the year 2020.
          </p>
        </Header>
        <Divider />
        <Article>
          <h2>Premise</h2>
          <p>
            CodeClusters is a web application for exploring and clustering student code to help
            teachers to understand their students' programming patterns at a deeper level. This
            lofty goal is approached by providing a search engine in the form of Apache Solr and
            models using scikit-learn implemented at the modeling server. This would allow teachers
            to search code for anomalies and cluster it by its similarities, and then send
            appropriate feedback either individually or to many students at once. The aim would be
            to reduce the amount of manual work when having to sift through a large number of
            submissions at once.
          </p>
          <h2>How it works</h2>
          <p>
            CodeClusters consists of 6 main parts: Nginx reverse proxy, React web app, Node.js
            backend, Postgres database, Flask modeling server and Solr search server. The student
            submissions are first stored in the Postgres, then indexed to the Solr. Automation in
            this matter has not been finalized yet, but in theory the ingestion of new data to
            CodeClusters should be seamless. Currently the only data at hand is the example dataset
            of MarsinLampotilanKeskiarvo.
          </p>
          <p>
            After the submissions have been indexed to Solr, additional attributes can be added to
            their indexes. So far this only means metrics and the counts of various tokens that can
            be run manually from the /solr page. Afterwards, those attributes can be used as facets
            (Apache Lucene feature), which is helpful at quickly subsetting the documents into
            suitable buckets. This hopefully would allow to detect anomalies and interesting
            correlations between different features.
          </p>
          <p>
            Using the search results list, the desired submissions can be selected and a review can
            be created. After accepting the reviews from the /reviews page, they should be sent to
            the students albeit the integration to current LMS systems is still missing. But in the
            future the students should be able to view their received reviews by logging in with
            their respective student accounts to the system.
          </p>
          <h2>Search</h2>
          <p>
            To explain in further detail the intricacies of the different parts, search is the main
            part of CodeClusters. Intended for quick ad-hoc querying, it serves as a primary method
            for dissecting student code for abnormal patterns. With a larger dataset this approach
            becomes more and more infeasible, as it becomes harder to find meaningful ways to search
            the code using user-inputted search queries.
            <br></br>
            <br></br>
            While capturing unorthodox use of keywords or highly nested loops is important aspect of
            student code reviewing, the importance of automatically clustering the code by their
            similarity becomes then more and more useful.
          </p>
          <h2>Modeling</h2>
          <p>
            With an appropriately large dataset the automatization of clustering becomes quite
            handy. While the methods for doing so are varied and debatable, since a lot depends on
            how the code is parsed and what data structures are used, CodeClusters offers some
            preliminary methods for experimenting with the clustering of code.
            <br></br>
            <br></br>
            As of now, the only available model is the n-grams which includes a lengthy description
            on its behavior. Running the model results in a couple of plots with each cluster being
            selectable. By the way model works also the data itself is loaded onto the CodeCluster's
            memory which might cause a performance bottleneck with larger datasets. This data is
            then searchable by the user.
          </p>
          <h2>Reviewing</h2>
          <p>
            Another main part of CodeClusters is the reviewing of the submissions. A key aspect of
            the whole system would be to enable teachers to write useful reviews that helps students
            to understand many of the quality and stylistic nuances of writing good code.
            <br></br>
            <br></br>
            How it works now, is by clicking individual search result items or by using the bottom
            right corner menu to select the whole page or all documents at once. After selecting the
            submissions a review can be written with optional metadata and tags that would later on
            come handy as labels for automating the review process itself.
            <br></br>
            <br></br>
            Once created, the review is marked as PENDING so not to immediately be visible to the
            students. From the /reviews page these reviews can be then modified and visualized
            before finally accepting them, after which they are sent to the students.
          </p>
          <h2>Review flows</h2>
          <p>
            An experimental way of automating the whole pipeline of searching and clustering code
            would be the creation of review flows. A review flow is a data structure containing the
            user-defined steps for searching and/or modeling the code with a pre-filled review text.
            This would in theory help teachers to reduce their time to review the code even more,
            and make sharing and re-using the same well crafted review flows easy.
            <br></br>
            <br></br>
            While not fully finalized in their behavior, review flows can be helpful for storing the
            most used and universally applicable reviews that would serve as a basis for perhaps
            even further automatizations.
          </p>
        </Article>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  margin: 40px auto 0 auto;
  max-width: 700px;
  padding-bottom: 20px;
  @media only screen and (max-width: 740px) {
    margin: 40px 20px 0 20px;
    padding-bottom: 20px;
  }
`
const Container = styled.div`
  align-items: center;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 1rem 3vw 0px 4vw;
  @media screen and (min-width: 1200px) {
    padding: 2rem 4rem 0 4rem;
  }
`
const Divider = styled.hr`
  border: 0;
  border-bottom: 1px solid #222;
  margin: 1rem 0 0 0;
  width: 100%;
`
const Header = styled.header`
  display: flex;
  flex-direction: column;
  width: 100%;
  h1 {
    margin: 2rem 0 1rem 0;
  }
`
const Article = styled.article`
  margin-bottom: 2rem;
  & > h2:first-child {
    margin-top: 2rem;
  }
`

export const ManualView = styled(ManualViewEl)``
