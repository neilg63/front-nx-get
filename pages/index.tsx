import type { NextPage, GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BaseEntity, fetchApiViewResults } from '../lib/api-view-results'
import { PageDataSet } from '../lib/entity-data'

const numRelatedLabel = (numRelated = 0) => {
  const pl = numRelated === 1 ? '' : 's';
  return numRelated > 0? `${numRelated} related artwork{pl}` : '';
}

const Home: NextPage<BaseEntity> = (data: BaseEntity) => {
  const pageData = new PageDataSet(data);
  const { items } = pageData;
  return (
    <>
      {items.map((item) => {
        return <li key={item.key} title={numRelatedLabel(item.num_related)}>
          <Link href={item.path}><a>{item.title}</a></Link>
        </li>
      })}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const pageData = await fetchApiViewResults('tags');
  return {
    props: {
      ...pageData
    },
  }
}

export default Home
