import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import NewsList from '../../components/news-list';
import { extractPageIndexFromContext, extractYearUriFromParams, isNumeric } from '../../lib/utils';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const uri = extractYearUriFromParams('news', context.params)
  const pageData = await fetchApiViewResults(uri, { page });
  return {
    props: pageData,
  }
}

export default NewsList;