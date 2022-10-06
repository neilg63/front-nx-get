import type { GetServerSideProps } from 'next'
import PublicationPage from '../../../components/publication-page';
import { fetchFullNode } from '../../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context?.params;
  const alias = ['about', 'publications', slug].join('/');
  const pageData = await fetchFullNode(alias);
  return {
    props: pageData
  }
}

export default PublicationPage;