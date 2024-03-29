import { NextPage } from "next";
import parse from "html-react-parser";
import { BaseEntity } from "../lib/interfaces";
import { PageDataSet } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";
import DateRange from "./widgets/date-range";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import { isObjectWith, notEmptyString } from "../lib/utils";
import { ShareWidget } from "./widgets/share-widget";


const PublicationPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
   const hasPublisher = entity.hasTextField('publisher');
  const showPublisher = hasPublisher && entity.field_publisher !== entity.title;
  const hasBody = notEmptyString(entity.body, 4);
  const hasLink =  isObjectWith(entity.field_link, 'uri') && notEmptyString(entity.field_link.uri, 4);
  const showYear = isObjectWith(entity, 'field_year') && entity.field_year > 1000;
  return  <>
    <SeoHead meta={meta} />
    <Container {...containerProps} className='exhibition-container left-align'>
      <article className="exhibition grid-2-header body-section">
        <header className='breadcrumb-header'>
        <h1><BreadcrumbTitle path={meta.path} title={entity.title} /></h1>
        </header>
        <div className='left-container'>{entity.hasImages && <Carousel items={entity.images} />}</div>
        <div className='text-details'>
          {showYear && <h4 className="year">{entity.field_year}</h4>}
          {hasBody && <div className="body">{parse(entity.body)}</div>}
          {showPublisher && <h4 className="publisher">{parse(entity.field_publisher)}</h4>}
          {hasLink && <div className="button"><a href={entity.field_link.uri} target="_blank" rel="noreferrer" className="shop-link">{entity.field_link.title}</a></div>}
          <ShareWidget meta={meta} />
        </div>
      </article>
    </Container>
    </>
}

export default PublicationPage;