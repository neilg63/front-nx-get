import Home from '../components/home'
import {  fetchFullNode } from '../lib/api-view-results'

export const getStaticProps = async (context: any) => {
  const pageData = await fetchFullNode('home');
  pageData.is404 = true;
  return {
    props: pageData,
  }
}

export default Home
