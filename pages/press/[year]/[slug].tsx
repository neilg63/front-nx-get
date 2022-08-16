import type { GetServerSideProps } from 'next'
import PressPage from '../../../components/press-page';
import { fetchFullNode } from '../../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { year, slug } = context?.params;
  const alias = ['press', year, slug].join('/');
  const pageData = await fetchFullNode(alias);
  return {
    props: pageData
  }
}

export default PressPage;