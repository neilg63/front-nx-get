import { NextPage } from "next";
import parse from "html-react-parser";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import MediaFigure from "./widgets/media-figure";
import { relatedKey } from "../lib/ui-entity";
import { relatedItemsTitle } from "../lib/content-types";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import { Container } from "@nextui-org/react";
import SeoHead from "./layout/head";
import Head from "next/head";
import { containerProps } from "../lib/styles";
import MiniRelatedItem from "./widgets/mini-related-item";
import RelatedItem from "./widgets/related-item";
import { ShareWidget } from "./widgets/share-widget";

const EssayPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/about/essays';
  return <><Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='essay-conatiner grid-sidebar'>
      <article className="essay text-max-width">
        <h1><BreadcrumbTitle path={meta.path} title={entity.title} /></h1>
        <h4 className='subtitle'><span className='medium-date'>{entity.mediumDate} </span> {entity.hasAuthor && <span className='author'>{entity.field_author}</span>}</h4>
        {entity.hasImage && <MediaFigure item={entity.field_media} size='large' width='100%' height='auto' objectFit='contain' />}    
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
        <ShareWidget meta={meta} />
      </article>
      <div className='related-content related'>
        {entity.hasRelatedArtworks && <div className='related-artworks related'>
          <h3>{ relatedItemsTitle("artwork") }</h3>
          <div className='column'>
            {entity.related_artworks.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={row} className='column' />)}
            </div>
        </div>}
        {entity.hasRelatedEssays && <div className='related-artworks related'>
          <h3>{relatedItemsTitle("article")}</h3>
          <div className='column'>
            {entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
      </div>
      
    </Container>
  </>
}

export default EssayPage;