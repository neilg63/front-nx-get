import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";
import Paginator from "./widgets/paginator";
import labels from "../lib/labels";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";

const EssayList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta, total, perPage } = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <AboutNav current='/about/press' />
      <section className="press-list">
      {hasItems && <>
        <ul>
        {items.map((item: NodeEntity) => <li key={item.uuid}>
          <time>{ mediumDate(item.field_date) }</time>
            <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
            <p>{item.summary}</p>
          </li>)} 
        </ul>
        {showPaginator && <Paginator pageData={pageData} maxLinks={8} />}
      </>}
    </section>
    </Container>
  </>
}

export default EssayList;