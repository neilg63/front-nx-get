import type { GetServerSideProps } from 'next'
import TagsMaze from '../../components/tags-maze'
import {  fetchApiViewResults } from '../../lib/api-view-results'

export const getServerSideProps: GetServerSideProps = async () => {
  const pageData = await fetchApiViewResults('tags');
  return {
    props: pageData,
  }
}

export default TagsMaze;