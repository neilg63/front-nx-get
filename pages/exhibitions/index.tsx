import type { GetStaticProps, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router';
import { fetchApiViewResults, getSiteInfo } from '../../lib/api-view-results';
import ExhibitionList from '../../components/exhibition-list';


export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const viewResults = await fetchApiViewResults('exhibitions');
  const site = await getSiteInfo();
  return {
    props: {
      items: viewResults,
      site
    },
    revalidate: false
  }
}

export default ExhibitionList;