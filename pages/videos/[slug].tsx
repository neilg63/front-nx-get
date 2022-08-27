import type { GetServerSideProps } from 'next'
import VideoPage from '../../components/video-page';
import { fetchFullNode } from '../../lib/api-view-results';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context?.params;
  const alias = ['videos', slug].join('/');
  const pageData = await fetchFullNode(alias);

  return {
    props: pageData
  }
}

export default VideoPage;