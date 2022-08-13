import type { GetServerSideProps, GetStaticPathsContext, GetStaticPathsResult, GetStaticProps, GetStaticPropsContext } from 'next'
import ExhibitionPage from '../../components/exhibition-page';
import { fetchFullNode } from '../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context?.params;
  const alias = ['exhibitions', slug].join('/');
  const pageData = await fetchFullNode(alias);

  return {
    props: pageData
  }
}

export default ExhibitionPage;