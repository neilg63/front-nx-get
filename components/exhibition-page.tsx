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
import contentTypes, { relatedItemsTitle } from "../lib/content-types";
import DateRange from "./widgets/date-range";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import ArtworkFigure from "./widgets/artwork-figure";


const ExhibitionPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='exhibition-container left-align'>
      <article className="exhibition grid-2-header body-section">
        <h1><BreadcrumbTitle path={meta.path} title={entity.title} /></h1>
        <div className='left-container'>{entity.hasImages && <Carousel items={entity.images} />}</div>
        <div className='text-details'>
          <h3><DateRange item={ entity.field_date_range } /></h3>
          {entity.hasSubtitle && <h4 className="subtitle">{parse(entity.field_subtitle)}</h4>}
          {entity.hasPlacename && <h5 className="placename">{entity.field_placename}</h5>}
          <div className="body">{parse(entity.body)}</div>
        </div>
      </article>

    {entity.hasRelatedArtworks && <div className='related-artworks related body-section'>
      <h3>{contentTypes.artwork}</h3>
      <div className='fixed-height-rows medium-height inner-captions'>
        {entity.related_artworks.map((row: NodeEntity, index: number) => <ArtworkFigure key={relatedKey(row, index)} item={row} index={index} />)}
      </div>
    </div>}
    {entity.hasRelatedPress && <div className='related-press related body-section'>
      <h3>{relatedItemsTitle('press')}</h3>
      <div className='flex-grid-2'>
        {entity.field_related_press.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={row} />)}
      </div>
    </div>}
    </Container>
    </>
}

export default ExhibitionPage;