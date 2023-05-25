import { NextPage } from "next";
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import PublicationItem from "./widgets/publication-item";

const PublicationList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta } = pageData;
  const hasItems = items.length > 0;
  return <>
    <Head>
      <title>{meta.title}</title>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='about-listing-container listing-main'>
      <AboutNav current='/about/publications' />
      <section className="publication-list grid-list">
        <>
        {hasItems && 
          <div className='fixed-height-rows tall-height'>
              {items.map((item: NodeEntity, index: number) => <PublicationItem key={['publication-item', item.uuid].join('-')} item={item} index={index } />)}
          </div>} 
          
        </>
      </section>
    </Container>
  </>
}

export default PublicationList;