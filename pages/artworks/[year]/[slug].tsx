import type { GetServerSideProps, GetStaticPathsContext, GetStaticPathsResult, GetStaticProps, GetStaticPropsContext } from 'next'
import ArtworkPage from '../../../components/artwork-page';
import { fetchFullNode } from '../../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { year, slug } = context?.params;
  const alias = ['artworks', year, slug].join('/');
  console.log(alias);
  const page = await fetchFullNode(alias);

  return {
    props: {
      ...page
    }
  }
}

export default ArtworkPage;