import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import ExhibitionList from '../../components/exhibition-list';
import { extractPageIndexFromContext } from '../../lib/utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context)
  const pageData = await fetchApiViewResults('exhibitions', {page});
  return {
    props: pageData
  }
}

export default ExhibitionList;