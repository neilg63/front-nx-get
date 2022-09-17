import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, NodeEntity, PageDataSet } from "../lib/entity-data";
import { longDate, mediumDate } from "../lib/converters";
import DownloadLink from "./widgets/download-link";
import labels from "../lib/labels";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";

const PressIntroList = ({ items, type, title }: { items: NodeEntity[]; type: string; title: string; }) => {
  const viewAllLink = ['/about/press', type].join("/");
  const hasItems = items.length > 0;
  const showTitle = type === 'release';
  const className = ['sublist', type].join(' ');
  return <>
    {hasItems && <div className={className}>
      <h3>{title}</h3>
      <ul className='press-items'>
        {items.map((item: NodeEntity) => <li key={item.uuid}>
          {showTitle && <span className='title'>{ item.title }</span>}
          <span className='publisher'>{item.field_source}</span>
          <time>{ longDate(item.field_date) }</time>
        {item.hasDocument && <DownloadLink item={item.field_document!} label={ labels.download_pdf} />}
      </li>)} 
        </ul>
        <div className='more-link'><Link href={viewAllLink}><a><span className='text-label'>{ labels.view_all}</span><i className='icon icon-next-arrow-narrow'></i></a></Link></div>
  </div>}
  </>
}

const PressLanding: NextPage<BaseEntity> = (data) => {  
  const pageData = new CompoundPageDataSet(data);
  const { items, meta } = pageData;
  const pressArticles = pageData.getEntities('press_articles');
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='about-listing-container left-align'>
      <AboutNav current='/about/press' />
      <section className="press-landing about-listing text-max-width">
        <PressIntroList items={pressArticles} type='printed' title={labels.press_articles} />
        <PressIntroList items={items} type='release' title={labels.press_releases} />
      </section>
    </Container>
  </>
}

export default PressLanding;