import type { GetStaticProps, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router';
import { fetchApiViewResults, getSiteInfo } from '../../lib/api-view-results';
import ArtworkList from '../../components/artwork-list';
import { isNumeric } from '../../lib/utils';


export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const yearRef = context.params?.year;
  let y = 0;
  if (isNumeric(yearRef)) {
    y = typeof yearRef === 'string' ? parseInt(yearRef, 10) : typeof yearRef === 'number' ? yearRef : 0;
  }
  if (y < 1950) {
    y = new Date().getFullYear();
  }
  const viewResults = await fetchApiViewResults('artworks/year');
  const site = await getSiteInfo();
  return {
    props: {
      items: viewResults,
      site
    },
  }
}

export default ArtworkList;