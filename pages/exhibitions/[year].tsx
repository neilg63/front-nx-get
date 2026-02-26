import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import ExhibitionList from '../../components/exhibition-list';
import { extractPageIndexFromContext, extractYearUriFromParams, notEmptyString } from '../../lib/utils';

const buildSoloGroupUri = (key: string) => {
  const suffix = key.startsWith('s') ? 'solo' : 'group';
  return 'exhibitions-by-' + suffix ;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const refKey = notEmptyString(context.params?.year, 3) ? context.params?.year : '';
  const refKeyStr = typeof refKey === 'string' ? refKey.toLowerCase() : '';
  const bySoloGroup = ['solo', 'group'].includes(refKeyStr);
  const uri = bySoloGroup ? buildSoloGroupUri(refKeyStr) : extractYearUriFromParams('exhibitions', context.params);
  const pageData = await fetchApiViewResults(uri, {page});
  return {
    props: pageData
  }
}

export default ExhibitionList;