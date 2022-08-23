import type { GetServerSideProps } from 'next'
import { fetchSearchResultsPage } from '../../lib/api-view-results';
import { extractPageIndexFromContext } from '../../lib/utils';
import SearchResults from '../../components/search-results';


export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context?.params;
  const page = extractPageIndexFromContext(context);
  const pageData = await fetchSearchResultsPage(slug, page);
  return {
    props: pageData,
  }
}

export default SearchResults;