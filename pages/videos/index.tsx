import type { GetServerSideProps } from 'next'
import { fetchApiViewResults } from '../../lib/api-view-results';
import VideoList from '../../components/video-list';
import { extractPageIndexFromContext } from '../../lib/utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = extractPageIndexFromContext(context);
  const pageData = await fetchApiViewResults('videos', {page});
  return {
    props: pageData
  }
}

export default VideoList;