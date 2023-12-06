import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, NodeEntity } from "../lib/entity-data";
import { longDate } from "../lib/converters";
import DownloadLink from "./widgets/download-link";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import { notEmptyString } from "../lib/utils";

const PressIntroList = ({ items, type, title, label, viewAll }: { items: NodeEntity[]; type: string; title: string; label: string, viewAll: string }) => {
  const viewAllLink = ['/about/press', type].join("/");
  const hasItems = items.length > 0;
  
  const showTitle = type === 'release';
  const renderPublisher = (item: NodeEntity): boolean => {
    return notEmptyString(item.field_source) ;
  }
  const renderTitle = (item: NodeEntity): boolean => {
    return showTitle || !renderPublisher(item);
  }
  const className = ['sublist', type].join(' ');
  return <>
    {hasItems && <div className={className}>
      <h3>{title}</h3>
      <ul className='press-items'>
        {items.map((item: NodeEntity) => <li key={item.uuid}>
          {renderTitle(item) && <span className='title'>{ item.title }</span>}
          {renderPublisher(item) && <span className='publisher'>{item.field_source}</span>}
          <time className='date'>{ longDate(item.field_date) }</time>
         {item.hasDocument && <DownloadLink item={item.field_document!} label={ label } />}
        </li>)} 
        </ul>
        <div className='more-link'><Link href={viewAllLink}><a>{viewAll}</a></Link></div>
  </div>}
  </>
}

const PressLanding: NextPage<BaseEntity> = (data) => {  
  const pageData = new CompoundPageDataSet(data);
  const { items, meta } = pageData;
  const pressArticles = pageData.getEntities('press_articles');

  const pressArticleTitle = pageData.label('press_articles');
  const downloadLabel = pageData.label('download_pdf');
  const pressReleaseTitel = pageData.label('press_releases');
  const viewAllLabel = pageData.label('more_link', 'more');
  return <>
    <SeoHead meta={meta} />
    <Container {...containerProps} className='about-listing-container left-align listing-main'>
      <AboutNav current='/about/press' />
      <section className="press-landing about-listing text-max-width">
        <PressIntroList items={pressArticles} type='printed' title={pressArticleTitle} label={downloadLabel} viewAll={ viewAllLabel } />
        <PressIntroList items={items} type='release' title={pressReleaseTitel} label={downloadLabel} viewAll={viewAllLabel} />
      </section>
    </Container>
  </>
}

export default PressLanding;