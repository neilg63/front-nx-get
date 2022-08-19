import type { GetServerSideProps } from 'next'
import NewsPage from '../../../components/news-page';
import { fetchFullNode } from '../../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { year, slug } = context?.params;
  const alias = ['news', year, slug].join('/');
  console.log(alias);
  const pageData = await fetchFullNode(alias);
  return {
    props: pageData
  }
}

export default NewsPage;