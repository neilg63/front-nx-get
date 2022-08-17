import { Container, Tooltip } from "@nextui-org/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BaseEntity } from "../lib/api-view-results";
import { PageDataSet } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import SeoHead from "./layout/head";

const numRelatedLabel = (numRelated = 0) => {
  const pl = numRelated === 1 ? '' : 's';
  return numRelated > 0? `${numRelated} related artwork${pl}` : '';
}

const Home: NextPage<BaseEntity> = (data: BaseEntity) => {
  const pageData = new PageDataSet(data);
  const { items, meta } = pageData;
  return (
    <>
      <Head>
        <SeoHead meta={meta} />
      </Head>
      <Container {...containerProps}>
        <ul className="tag-list">
        {items.map((item) => {
            return <li key={item.key}>
              <Tooltip content={numRelatedLabel(item.num_related)} rounded={false} shadow={false} className='bordered'><Link href={item.path}><a>{item.title}</a></Link></Tooltip>
            </li>
          })}
        </ul>
      </Container>
    </>
    
  )
}

export default Home;