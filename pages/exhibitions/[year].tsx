import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import ExhibitionList from '../../components/exhibition-list';
import { extractPageIndexFromContext, extractYearUriFromParams } from '../../lib/utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const uri = extractYearUriFromParams('exhibitions', context.params);
  const pageData = await fetchApiViewResults(uri, {page});
  return {
    props: pageData
  }
}

export default ExhibitionList;