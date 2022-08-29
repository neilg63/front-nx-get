import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../../lib/api-view-results';
import { extractPageIndexFromContext } from '../../../lib/utils';
import Timeline from '../../../components/timeline';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const selected = context?.params?.date || '';
  const pageData = await fetchApiViewResults('timeline', { page });
  return {
    props: {...pageData, selected },
  }
}

export default Timeline;