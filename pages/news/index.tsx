import type { GetServerSideProps } from 'next'
import Home from '../../components/home'
import {  fetchFullNode } from '../../lib/api-view-results'

export const getServerSideProps: GetServerSideProps = async () => {
  const pageData = await fetchFullNode('home');
  return {
    props: pageData,
  }
}

export default Home
