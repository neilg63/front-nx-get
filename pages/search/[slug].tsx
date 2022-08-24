import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic';
import { fetchSearchResultsPage } from '../../lib/api-view-results';
import { extractPageIndexFromContext } from '../../lib/utils';
const SearchResults = dynamic(() => import('../../components/search-results'));

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context?.params;
  const page = extractPageIndexFromContext(context);
  const pageData = await fetchSearchResultsPage(slug, page);
  return {
    props: pageData,
  }
}

export default SearchResults;