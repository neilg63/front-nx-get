import type { GetServerSideProps } from 'next'
import TagsMaze from '../../components/tags-maze'
import {  fetchApiViewResults } from '../../lib/api-view-results'

export const getServerSideProps: GetServerSideProps = async () => {
  const pageData = await fetchApiViewResults('art-tags');
  if (pageData.items) {
    pageData.items.sort((a: any, b: any) => {
      let randVal = Math.random() - Math.random();
      if (a.tid && b.tid) {
        return randVal * 10;
      } else {
        return randVal;
      }
    });
  }
  return {
    props: pageData,
  }
}

export default TagsMaze;