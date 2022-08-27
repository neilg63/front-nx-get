import type { GetServerSideProps } from 'next';
import AboutLanding from '../../components/about-landing';
import { fetchFullNode } from '../../lib/api-view-results';


export const getServerSideProps: GetServerSideProps = async () => {
  const page = await fetchFullNode('about');
  return {
    props: page
  }
}

export default AboutLanding;
