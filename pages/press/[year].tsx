import type { GetServerSideProps } from 'next'
import PressList from '../../components/press-list';
import { fetchApiViewResults } from '../../lib/api-view-results';
import { extractPageIndexFromContext, isNumeric } from '../../lib/utils';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const page = extractPageIndexFromContext(context);
  const yearRef = context.params?.year;
  let y = 0;
  let first = 'press-releases';
  let second = '';
  if (isNumeric(yearRef) && yearRef.length === 4) {
    y = typeof yearRef === 'string' ? parseInt(yearRef, 10) : typeof yearRef === 'number' ? yearRef : 0;
    if (y < 1960) {
      y = new Date().getFullYear();
    }
    second = y.toString();
  }
  const uri = [first, second].join('/');
  const pageData = await fetchApiViewResults(uri, { page });
  return {
    props: pageData
  }
}

export default PressList;