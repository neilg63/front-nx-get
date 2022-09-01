import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import TagList from "./widgets/tag-list";
import TypeLink from "./widgets/type-link";
import YearLink from "./widgets/year-link";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import SeoHead from "./layout/head";
import Head from "next/head";
import Carousel from "./widgets/carousel";
import RelatedItem from "./widgets/related-item";
import { relatedKey } from "../lib/ui-entity";
import contentTypes from "../lib/content-types";
import MiniRelatedItem from "./widgets/mini-related-item";

const ArtworkPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/artworks';
  const basePath = '/artworks';
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='grid-sidebar'>
      <article className="artwork">
        <header>
          <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
          {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
        </header>
        {entity.hasImages && <Carousel items={entity.images} />}
        <div className="info">
          <p className="year-type links-2"><TypeLink value={entity.field_type} basePath={basePath} /> <YearLink value={entity.field_year} basePath={basePath} /></p>
          {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
          <TagList terms={entity.field_tags} base={basePath} prefix="tag" />
        </div>
      </article>
      <aside className='sidebar sidebar-right'>
        {entity.hasRelatedExhibitions && <div className='related-exhibitions related'>
          <h3>{contentTypes.exhibition}</h3>
          <div className='columns'>
            {entity.field_related_exhibitions.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>}
        {entity.hasRelatedEssays && <div className='related-essays related'>
          <h3>{contentTypes.article}</h3>
          <div className='columns'>
            {entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>}
        {entity.hasRelatedPresss && <div className='related-press related'>
          <h3>{contentTypes.press}</h3>
          <div className='columns'>
            {entity.field_related_press.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>}
      </aside>
    </Container>
  </>
}

export default ArtworkPage;