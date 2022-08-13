import type { GetServerSideProps } from 'next'
import NewsPage from '../../components/news-page';
import { fetchFullNode } from '../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context?.params;
  const alias = ['news', slug].join('/');
  const pageData = await fetchFullNode(alias);

  return {
    props: {
      ...pageData
    }
  }
}

export default NewsPage;