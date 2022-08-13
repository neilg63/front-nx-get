import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import ExhibitionList from '../../components/exhibition-list';
import { smartCastInt } from '../../lib/utils';


export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const paramKeys = context.query instanceof Object ? Object.keys(context.query) : [];
  const pageRef = paramKeys.includes('page') ? smartCastInt(context.query.page, 10) : 1;
  const page = pageRef > 1 ? pageRef - 1 : 0;
  const pageData = await fetchApiViewResults('exhibitions', {page});
  return {
    props: pageData
  }
}

export default ExhibitionList;