import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../../lib/api-view-results';
import { extractPageIndexFromContext } from '../../../lib/utils';
import PressList from '../../../components/press-list';

const matchPressType = (type: any = null) => {
  const key = typeof type === 'string' ? type.toLowerCase() : '';
  switch (key) {
    case 'article':
    case 'articles':
    case 'printed':
      return 'printed';
    default:
      return 'release';
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const typeRef = context.params?.type;
  const type = matchPressType(typeRef);
  const uri = type === 'release' ? 'press-releases' : 'press-printed';
  const pageData = await fetchApiViewResults(uri, { page });
  return {
    props: pageData,
  }
}

export default PressList;