import { NextPage } from "next";
import parse from "html-react-parser";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";
import RelatedItem from "./widgets/related-item";
import { relatedKey } from "../lib/ui-entity";
import BreadcrumbTitle from "./widgets/breadcrumb-title";

const NewsPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta, items, labels } = pageData;
  const topItems = items instanceof Array ? items.filter(item => item.path !== entity.path) : [];
  const hasItems = topItems.length > 0;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='grid-sidebar'>
      <article className="news">
        <h1><BreadcrumbTitle path={pageData.meta.path} title={ entity.title } /></h1>
        {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
        {entity.hasImages && <Carousel items={entity.images} />}
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      </article>
      <aside className='sidebar sidebar-right'>
        <div className='related-artworks related'>
          <h3>{ labels.get('latest_news') }</h3>
          <div className='columns'>
            {hasItems && topItems.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>
      </aside>
    </Container>
  </>
}

export default NewsPage;