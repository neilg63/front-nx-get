import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import { extractPageIndexFromContext } from '../../lib/utils';
import SearchResults from '../../components/search-results';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const pageData = await fetchApiViewResults('press-releases', { page });
  return {
    props: pageData,
  }
}

export default SearchResults;