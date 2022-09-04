import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";
import DownloadLink from "./widgets/download-link";
import labels from "../lib/labels";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import LoadMoreNav from "./widgets/load-more-nav";

const PressList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta, total, perPage } = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='about-listing-container'>
      <AboutNav current='/about/press' />
      <section className="press-list about-listing">
      {hasItems && <>
        <div className='press-releases  flex-grid-2'>
        {items.map((item: NodeEntity) => <div className='related-mini' key={item.uuid}>
          <time>{ mediumDate(item.field_date) }</time>
            <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
            <p>{item.field_source}</p>
          {item.hasDocument && <DownloadLink item={item.field_document!} label={ labels.download_pdf} />}
          </div>)} 
        </div>
        {showPaginator && <LoadMoreNav data={pageData} />}
      </>}
    </section>
    </Container>
  </>
}

export default PressList;