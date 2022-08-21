import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";

const NewsPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/news';
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <article className="news">
    <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
        {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
        {entity.hasImages && <Carousel items={entity.images} />}
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      </article>
    </Container>
  </>
}

export default NewsPage;