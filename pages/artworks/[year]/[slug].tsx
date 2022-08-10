import type { GetServerSideProps, GetStaticPathsContext, GetStaticPathsResult, GetStaticProps, GetStaticPropsContext } from 'next'
import ArtworkPage from '../../../components/artwork-page';
import { fetchFullNode } from '../../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { artwork, year, slug } = context?.params;
  const alias = [artwork, year, slug].join('/');
  const page = await fetchFullNode(alias);

  return {
    props: {
      ...page
    }
  }
}

export default ArtworkPage;