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
import { mediumDate } from "../lib/converters";
import labels from "../lib/labels";
import VideoPreview from "./widgets/video-preview";
import { relatedKey } from "../lib/ui-entity";

const VideoPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/videos';
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='video-container grid-sidebar'>
    <article className="video">
        <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
        {entity.hasVideo && <iframe className="video" src={entity.vimeoUrl} allow="allowfullscreen allowtransparency autoplay"></iframe>}
        <p>{ mediumDate(entity.field_date) }</p>
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
        
      </article>
      <aside className='sidebar sidebar-right'>
        {entity.hasRelatedVideos && <div className='related-videos related'>
          <h3>{labels.related_videos}</h3>
          <div className='column'>
            {entity.field_related_videos.map((row: NodeEntity, index: number) => <VideoPreview key={relatedKey(row, index)} node={row}/>)}
          </div>
        </div>}
      </aside>
    </Container>
    </>
}

export default VideoPage;