import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";
import labels from "../lib/labels";
import RelatedItem from "./widgets/related-item";
import { relatedKey } from "../lib/ui-entity";

const NewsPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta, items } = pageData;
  const hasItems = items instanceof Array && items.length > 0;
  const nextAlias = '/news';
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='grid-sidebar'>
      <article className="news">
        <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
        {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
        {entity.hasImages && <Carousel items={entity.images} />}
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      </article>
      <aside className='sidebar sidebar-right'>
        <div className='related-artworks related'>
          <h3>{ labels.latest_news }</h3>
          <div className='columns'>
            {hasItems && items.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>
      </aside>
    </Container>
  </>
}

export default NewsPage;