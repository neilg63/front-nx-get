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
import { mediumDate } from "../lib/converters";

const VideoPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/videos';
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='video-container'>
    <article className="video">
        <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
        {entity.hasVideo && <iframe className="video" src={entity.vimeoUrl} allow="allowfullscreen allowtransparency autoplay"></iframe>}
        <p>{ mediumDate(entity.field_date) }</p>
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      </article>
    </Container>
    </>
}

export default VideoPage;