import type { GetServerSideProps } from 'next'
import EssayPage from '../../components/essay-page';
import { fetchFullNode } from '../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context?.params;
  const alias = ['info', slug].join('/');
  const pageData = await fetchFullNode(alias);
  return {
    props: pageData
  }
}

export default EssayPage;