import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../../lib/api-view-results';
import { extractPageIndexFromContext } from '../../../lib/utils';
import EssayList from '../../../components/essay-list';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const pageData = await fetchApiViewResults('essays', { page });
  return {
    props: pageData,
  }
}

export default EssayList;