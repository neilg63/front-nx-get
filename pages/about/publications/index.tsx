import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../../lib/api-view-results';
import PublicationList from '../../../components/publication-list';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uri = 'publications';
  const pageData = await fetchApiViewResults(uri);
  return {
    props: pageData,
  }
}

export default PublicationList;