import type { GetServerSideProps, GetStaticPathsContext, GetStaticPathsResult, GetStaticProps, GetStaticPropsContext } from 'next'
import ExhibitionPage from '../../components/exhibition-page';
import { fetchFullNode } from '../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { exhibitions, slug } = context?.params;
  const alias = [exhibitions, slug].join('/');
  const page = await fetchFullNode(alias);

  return {
    props: {
      ...page
    }
  }
}

export default ExhibitionPage;