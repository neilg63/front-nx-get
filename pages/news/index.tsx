import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import NewsList from '../../components/news-list';


export const getServerSideProps: GetServerSideProps = async () => {
  const pageData = await fetchApiViewResults('news');
  return {
    props: {
      ...pageData
    },
  }
}

export default NewsList;