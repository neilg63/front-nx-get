import { NextPage } from "next";
import Link from 'next/link';
import parse from "html-react-parser";
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";
import RelatedItem from "./widgets/related-item";
import { relatedKey } from "../lib/ui-entity";


const ExhibitionPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/exhibitions';
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='exhibition-container'>
      <article className="exhibition">
          <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
          {entity.hasSubtitle && <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>}
          {entity.hasImages && <Carousel items={entity.images} />}
        <div className="body">{parse(entity.body)}</div>
        <div className='related-artworks flex-grid-2'>
          {entity.hasRelatedArtworks && entity.related_artworks.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={ row } />)}
        </div>
        </article>
    </Container>
    </>
}

export default ExhibitionPage;