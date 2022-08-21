import { NextPage } from "next";
import Link from 'next/link';
import parse from "html-react-parser";
import { BaseEntity } from "../lib/interfaces";
import { PageDataSet } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import Head from "next/head";
import SeoHead from "./layout/head";
import Carousel from "./widgets/carousel";

const ExhibitionPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/exhibitions';
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
    <article className="exhibition">
        <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
        {entity.hasSubtitle && <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>}
        {entity.hasImages && <Carousel items={entity.images} />}
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      </article>
    </Container>
    </>
}

export default ExhibitionPage;