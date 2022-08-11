import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { fetchApiViewResults } from '../../lib/api-view-results';
import ArtworkList from '../../components/artwork-list';


export const getServerSideProps: GetServerSideProps = async () => {
  const pageData = await fetchApiViewResults('artworks');
  return {
    props: {
      ...pageData
    },
  }
}

export default ArtworkList;