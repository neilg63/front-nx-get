import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import LoadMoreNav from "./widgets/load-more-nav";

const EssayList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta, total, perPage } = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='about-listing-container'>
      <AboutNav current='/about/essays' />
      <section className="essay-list about-listing">
      {hasItems && <>
        <ul>
        {items.map((item: NodeEntity) => <li key={item.uuid}>
            <h3><Link href={item.path}><a><span className='text-label'>{item.title}</span> <time>{ mediumDate(item.field_date) }</time></a></Link></h3>
            <p className='summary small'>{item.summary}</p>
          </li>)} 
        </ul>
        {showPaginator && <LoadMoreNav data={pageData} />}
      </>}
    </section>
    </Container>
  </>
}

export default EssayList;