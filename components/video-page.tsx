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
import contentTypes, { relatedItemsTitle } from "../lib/content-types";
import MiniRelatedItem from "./widgets/mini-related-item";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import PressPreview from "./widgets/press-preview";
import { ShareWidget } from "./widgets/share-widget";

const VideoPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta, site} = pageData;
  const download_label = site.label('download_pdf');
  const relatedPressReleases = entity.hasRelatedPress ? entity.field_related_press.filter((p:NodeEntity) => p.isPressRelease) : [];
  const hasRelatedPressReleases = relatedPressReleases.length > 0;
  const relatedPressPrinted = entity.hasRelatedPress ? entity.field_related_press.filter((p:NodeEntity) => p.isPressArticle) : [];
  const hasRelatedPressPrinted = relatedPressPrinted.length > 0;
  return  <>
    <Head>
      <title>{meta.title}</title>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='video-container grid-sidebar'>
    <article className="video">
        <header className='breadcrumb-header'>
          <h1><BreadcrumbTitle path={entity.path} title={ entity.title } /></h1>
        </header>
        {entity.hasVideo && <iframe className="video" src={entity.videoUrl} allow={entity.videoAllowKeys}></iframe>}
        <div className="text-details">
          <h2 className='title'>{entity.title}</h2>
          <p>{ mediumDate(entity.field_date) }</p>
          {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
        </div>
        <ShareWidget meta={meta} />
      </article>
      <aside className='sidebar sidebar-right'>
        {entity.hasRelatedExhibitions && <div className='related-exhibitions related'>
          <h3>{relatedItemsTitle('exhibition')}</h3>
          <div className='column'>
            {entity.field_related_exhibitions.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
        {entity.hasRelatedEssays && <div className='related-essays related body-section'>
          <h3>{contentTypes.article}</h3>
          <div className='column'>
            {entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>} 
        {hasRelatedPressPrinted && <div className='related-press related'>
          <h3>{contentTypes.press_article}</h3>
          <div className='column'>
            {relatedPressPrinted.map((row: NodeEntity, index: number) => <PressPreview key={relatedKey(row, index)} item={row} label={ download_label } dateMode='none' />)}
          </div>
        </div>}
        {hasRelatedPressReleases && <div className='related-press related'>
          <h3>{contentTypes.press_article}</h3>
          <div className='column'>
            {relatedPressReleases.map((row: NodeEntity, index: number) => <PressPreview key={relatedKey(row, index)} item={row} label={ download_label } dateMode='none' />)}
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