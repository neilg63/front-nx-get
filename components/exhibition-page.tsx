import { NextPage } from "next";
import parse from "html-react-parser";
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";
import { relatedKey } from "../lib/ui-entity";
import contentTypes from "../lib/content-types";
import DateRange from "./widgets/date-range";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import ArtworkFigure from "./widgets/artwork-figure";
import PressPreview from "./widgets/press-preview";
import MiniRelatedItem from "./widgets/mini-related-item";


const ExhibitionPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta, site } = pageData;
  const download_label = site.label('download_pdf');
const relatedPressReleases = entity.hasRelatedPress ? entity.field_related_press.filter((p:NodeEntity) => p.isPressRelease) : [];
const hasRelatedPressReleases = relatedPressReleases.length > 0;
const relatedPressPrinted = entity.hasRelatedPress ? entity.field_related_press.filter((p:NodeEntity) => p.isPressArticle) : [];
const hasRelatedPressPrinted = relatedPressPrinted.length > 0;
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='exhibition-container left-align'>
      <article className="exhibition grid-2-header body-section">
        <h1><BreadcrumbTitle path={meta.path} title={entity.title} /></h1>
        <div className='left-container'>{entity.hasImages && <Carousel items={entity.images} />}</div>
        <div className='text-details'>
          <h2 className='title'>{entity.title}</h2>
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
     {entity.hasRelatedEssays && <div className='related-essays related body-section'>
      <h3>{contentTypes.article}</h3>
      <div className='column'>
        {entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
      </div>
    </div>} 
    {hasRelatedPressPrinted && <div className='related-press related body-section'>
      <h3>{contentTypes.press_printed}</h3>
      <div className='column'>
      {relatedPressPrinted.map((row: NodeEntity, index: number) => <PressPreview key={relatedKey(row, index)} item={row} label={ download_label } dateMode='none' />)}
      </div>
    </div>}
    {hasRelatedPressReleases && <div className='related-press related body-section'>
      <h3>{contentTypes.press_release}</h3>
      <div className='column'>
      {relatedPressReleases.map((row: NodeEntity, index: number) => <PressPreview key={relatedKey(row, index)} item={row} label={ download_label } dateMode='none' />)}
      </div>
    </div>}
    </Container>
    </>
}

export default ExhibitionPage;