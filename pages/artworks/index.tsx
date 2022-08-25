import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import ArtworkList from '../../components/artwork-list';
import { extractPageIndexFromContext } from '../../lib/utils';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const pageData = await fetchApiViewResults('artworks', {page});
  return {
    props: pageData,
  }
}

export default ArtworkList;