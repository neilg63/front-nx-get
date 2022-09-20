import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import NewsList from '../../components/news-list';
import { extractPageIndexFromContext } from '../../lib/utils';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const pageData = await fetchApiViewResults('news', { page });
  return {
    props: pageData,
  }
}

export default NewsList;
