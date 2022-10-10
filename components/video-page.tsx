import { NextPage } from "next";
import Link from 'next/link';
import parse from "html-react-parser";
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import Head from "next/head";
import SeoHead from "./layout/head";
import { mediumDate } from "../lib/converters";
import labels from "../lib/labels";
import VideoPreview from "./widgets/video-preview";
import { relatedKey } from "../lib/ui-entity";
import { relatedItemsTitle } from "../lib/content-types";
import MiniRelatedItem from "./widgets/mini-related-item";
import BreadcrumbTitle from "./widgets/breadcrumb-title";

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
        <h1><BreadcrumbTitle path={entity.path} title={ entity.title } /></h1>
        {entity.hasVideo && <iframe className="video" src={entity.videoUrl} allow={entity.videoAllowKeys}></iframe>}
        <p>{ mediumDate(entity.field_date) }</p>
        {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
        
      </article>
      <aside className='sidebar sidebar-right'>
        {entity.hasRelatedExhibitions && <div className='related-exhibitions related'>
          <h3>{relatedItemsTitle('exhibition')}</h3>
          <div className='column'>
            {entity.field_related_exhibitions.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
        {entity.hasRelatedVideos && <div className='related-press related'>
          <h3>{relatedItemsTitle('press')}</h3>
          <div className='column'>
            {entity.field_related_press.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
        {entity.hasRelatedVideos && <div className='related-press related'>
          <h3>{relatedItemsTitle('article')}</h3>
          <div className='column'>
            {entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
      </aside>

      {entity.hasRelatedVideos && <div className='related-videos related grid-list'>
        <h3>{labels.related_videos}</h3>
        <div className='columns'>
          {entity.field_related_videos.map((row: NodeEntity, index: number) => <VideoPreview key={relatedKey(row, index)} node={row}/>)}
        </div>
      </div>}
    </Container>
    </>
}

export default VideoPage;