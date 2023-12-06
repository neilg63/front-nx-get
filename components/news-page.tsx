import { NextPage } from "next";
import parse from "html-react-parser";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";
import NewsItemPreview from "./widgets/news-item-preview";
import { relatedKey } from "../lib/ui-entity";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import { shortDate } from "../lib/converters";
import { ShareWidget } from "./widgets/share-widget";

const NewsPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta, items, site } = pageData;
  const topItems = items instanceof Array ? items.filter(item => item.path !== entity.path) : [];
  if (topItems.length > 3) {
    topItems.pop();
  }
  const hasItems = topItems.length > 0;
  return <>
    <SeoHead meta={meta} />
    <Container {...containerProps} className='grid-sidebar'>
      <article className="news">
        <header className='breadcrumb-header'>
          <h1><BreadcrumbTitle path={pageData.meta.path} title={ entity.title } /></h1>
        </header>
        {entity.hasImages && <Carousel items={entity.images} />}
        <div className="text-details">
          <h4 className='date'>{ shortDate(entity.field_date) }</h4>
          <h2 className='title'>{entity.title}</h2>
          {entity.hasSubtitle && <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>}
          {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
        </div>
        <ShareWidget meta={meta} />
      </article>
      <aside className='sidebar sidebar-right'>
        <div className='related-news related'>
          <h3>{ site.label('other_news', 'Other news') }</h3>
          <div className='columns'>
            {hasItems && topItems.map((row: NodeEntity, index: number) => <NewsItemPreview key={relatedKey(row, index)} node={row} />)}
          </div>
        </div>
      </aside>
    </Container>
  </>
}

export default NewsPage;