import type { GetServerSideProps, GetStaticProps, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router';
import { fetchApiViewResults, getSiteInfo } from '../../lib/api-view-results';
import ExhibitionList from '../../components/exhibition-list';


export const getServerSideProps: GetServerSideProps = async () => {
  const pageData = await fetchApiViewResults('exhibitions');
  return {
    props: {
      ...pageData
    },
    revalidate: false
  }
}

export default ExhibitionList;