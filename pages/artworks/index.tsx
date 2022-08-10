import type { GetStaticProps, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router';
import { fetchApiViewResults, getSiteInfo } from '../../lib/api-view-results';
import ArtworkList from '../../components/artwork-list';


export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const viewResults = await fetchApiViewResults('artworks');
  const site = await getSiteInfo();
  return {
    props: {
      items: viewResults,
      site
    },
    revalidate: false
  }
}

export default ArtworkList;