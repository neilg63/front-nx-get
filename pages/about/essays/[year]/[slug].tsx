import type { GetServerSideProps } from 'next'
import EssayPage from '../../../../components/essay-page';
import { fetchFullNode } from '../../../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { year, slug } = context?.params;
  const alias = ['about', 'essays', year, slug].join('/');
  const pageData = await fetchFullNode(alias);
  return {
    props: pageData
  }
}

export default EssayPage;