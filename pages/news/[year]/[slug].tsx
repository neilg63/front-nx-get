import type { GetServerSideProps, GetStaticPathsContext, GetStaticPathsResult, GetStaticProps, GetStaticPropsContext } from 'next'
import NewsPage from '../../../components/news-page';
import { fetchFullNode } from '../../../lib/api-view-results';

export interface PathMap {
  [key: string]: string
}


export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { news, year, slug } = context?.params;
  const alias = [news, year, slug].join('/');
  const page = await fetchFullNode(alias);

  return {
    props: {
      page
    }
  }
}

export default NewsPage;