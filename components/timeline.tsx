import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, NodeEntity } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";
import labels from "../lib/labels";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";

const Timeline: NextPage<BaseEntity> = (data) => {  
  const pageData = new CompoundPageDataSet(data);
  const { items, meta } = pageData;
  const hasItems = items.length > 0;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <AboutNav current='/about/timeline' />
      <section className="timeline-items full-width">
        <h2 className='section-header'>Timeline</h2>
        <p>This will be the timeline</p>
        <div className="timeline-nav"></div>
      </section>
    </Container>
  </>
}

export default Timeline;