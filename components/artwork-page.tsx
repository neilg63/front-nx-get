import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/api-view-results";
import TagList from "./widgets/tag-list";
import TypeLink from "./widgets/type-link";
import YearLink from "./widgets/year-link";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import SeoHead from "./layout/head";
import Head from "next/head";
import Carousel from "./widgets/carousel";

const ArtworkPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/artworks';
  const basePath = '/artworks';
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <article className="artwork">
          <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
          <div className="info">
          {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
          <TypeLink value={entity.field_type} basePath={basePath} />
          <YearLink value={entity.field_year} basePath={basePath} />
          {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
            <TagList terms={entity.field_tags} base={basePath} prefix="tag" />
          </div>
        {entity.hasImages && <Carousel items={entity.images} />}
      </article>
    </Container>
  </>
}

export default ArtworkPage;