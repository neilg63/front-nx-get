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

/* const SummaryBlock = ({ item }: { item: NodeEntity }) => {
  return <div className='body summary'><Link href={item.path}><a>{ item.summary }</a></Link></div>
} */

const EssayList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta, total, perPage } = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  return <>
    <SeoHead meta={meta} />
    <Container {...containerProps} className='about-listing-container left-align'>
      <AboutNav current='/about/essays' />
      <section className="essay-list about-listing grid-half-header">
      {hasItems && <>
        <ul className='essay-list-items'>
        {items.map((item: NodeEntity) => <li key={item.uuid} className='essay-preview'>
          <h3 title={item.shortSummary}><Link href={item.path}><a>
            <span className='text-label'>{item.title}</span>
            {item.hasAuthor && <span className='author'>{item.field_author}</span>}
              <time>{mediumDate(item.field_date)}</time>
          </a></Link></h3>
            
          </li>)} 
        </ul>
        {showPaginator && <LoadMoreNav data={pageData} />}
      </>}
    </section>
    </Container>
  </>
}

export default EssayList;