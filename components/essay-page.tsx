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

const EssayPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/about/essays';
  return <><Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='essay-conatiner grid-sidebar'>
      <article className="essay">
        <h1><BreadcrumbTitle path={ meta.path } title={ entity.title } /></h1>
        {entity.hasImage && <MediaFigure item={ entity.field_media } size='large' width='100%' height='auto' objectFit='contain' />}
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      </article>
      <div className='related-artworks related'>
        <h3>{ relatedItemsTitle("article") }</h3>
        <div className='column'>
          {entity.hasRelatedEssays && entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic'/>)}
        </div>
      </div>
    </Container>
  </>
}

export default EssayPage;