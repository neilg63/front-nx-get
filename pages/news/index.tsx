import type { GetStaticProps, GetStaticPropsContext } from 'next'
import { fetchApiViewResults, getSiteInfo } from '../../lib/api-view-results';
import NewsList from '../../components/news-list';


export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const viewResults = await fetchApiViewResults('news');
  const site = await getSiteInfo();
  return {
    props: {
      items: viewResults,
      site
    },
  }
}

export default NewsList;