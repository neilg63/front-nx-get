import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";
import DownloadLink from "./widgets/download-link";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import LoadMoreNav from "./widgets/load-more-nav";
import PressPreview from "./widgets/press-preview";

const PressList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta, total, perPage, labels } = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  const download_label = pageData.label('download_pdf');
  return <>
    <SeoHead meta={meta} />
    <Container {...containerProps} className='about-listing-container listing-main'>
      <AboutNav current='/about/press' />
      <section className="press-list about-listing">
        <>
        {hasItems && 
          <div className='press-releases text-max-width'>
              {items.map((item: NodeEntity) => <PressPreview key={['press-item', item.id].join('-') }  item={item} label={ download_label } />)}
          </div>} 
          {showPaginator && <LoadMoreNav data={pageData} />}
        </>
      </section>
    </Container>
  </>
}

export default PressList;