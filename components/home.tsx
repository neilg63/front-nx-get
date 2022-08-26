import { Container, Image, Tooltip } from "@nextui-org/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, MediaItem, NodeEntity, SimpleTerm } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import SeoHead from "./layout/head";
import { useEffect, useState } from "react";
import { clearLocal, fromLocal, hasLocal, toLocal } from "../lib/localstore";
import NewsItemPreview from "./widgets/news-item-preview";
import VideoPreview from "./widgets/video-preview";
import ExhibitionPreview from "./widgets/exhibition-preview";

const numRelatedLabel = (numRelated = 0) => {
  const pl = numRelated === 1 ? '' : 's';
  return numRelated > 0? `${numRelated} related artwork${pl}` : '';
}

const toKey = (prefix = '', slug = '', index = 0) => {
  return [prefix, slug, index].join('-');
}

const buildSplashClasses = (): string => {
  const hasSeenRef = hasLocal('splash-viewed');
  const cls = ['splash-overlay'];
  let hasSeen = false;
  if (hasSeenRef) {
    const stored = fromLocal('splash-viewed', 3600);
    if (!stored.expired) {
      hasSeen = stored.data === true || stored.data === 'true';
    }
  }
  if (!hasSeen) {
    cls.push('show-splash');
  }
  return cls.join(' ');
}

const Home: NextPage<BaseEntity> = (data: BaseEntity) => {
  const pageData = new CompoundPageDataSet(data);
  const { meta } = pageData;
  const [splashClasses, setSplashClasses] = useState('splash-overlay');
  const tags = pageData.getWidgetTerms('tags');
  const splashItems = pageData.getMediaItems('splash');
  const numItems = splashItems instanceof Array ? splashItems.length : 0;
  const randIndex = Math.floor(Math.random() * 0.999999 * numItems);
  const splash = numItems > 0 ? splashItems[randIndex] : new MediaItem();
  const hasSplash = numItems > 0;
  const hasCurrExhib = pageData.widgets.has('current_exhibition')
  const currentExhibition = pageData.getEntity('current_exhibition');
  const newsItems = pageData.getEntities('latest_news');
  const hasNews = newsItems.length > 0;
  const videos = pageData.getEntities('latest_videos');
  const hasVideos = videos.length > 0;
  const hideSplash = () => {
    toLocal('splash-viewed', true);
    setSplashClasses('splash-overlay');
  }

  const showSplash = () => {
    clearLocal('splash-viewed');
    setSplashClasses('splash-overlay show-splash');
  }

  useEffect(() => {
    setSplashClasses(buildSplashClasses());
  },[splashClasses, setSplashClasses])
  return (
    <>
      <Head>
        <SeoHead meta={meta} />
      </Head>
      <Container {...containerProps} className="home-container">
        {hasCurrExhib && <section className='current-exhibition'><h2>Current Exhibition</h2><ExhibitionPreview node={ currentExhibition } /></section>}
        {hasNews && <section className='news-previews column'>
          {newsItems.map((item: NodeEntity) => <NewsItemPreview key={['news', item.uuid].join('-')} node={item} />)}
          <h3 className='more-link'><Link href='/news'><a>More</a></Link></h3>
        </section>}
            {hasVideos && <section className='video-previews row'>{videos.map((item: NodeEntity) => <VideoPreview key={['video', item.uuid].join('-')} node={item} />)}
        </section>}
        <ul className="tag-list">
        {tags.map((item: SimpleTerm, index: number) => {
          return <li key={toKey('tag', item.slug, index)}>
              <Tooltip content={numRelatedLabel(item.num_related)} rounded={false} shadow={false} className='bordered'><Link href={item.path}><a>{item.title}</a></Link></Tooltip>
            </li>
          })}
        </ul>
        <p className="show-splash-link" onClick={() => showSplash()}>Show splash</p>
      </Container>
      {hasSplash && <aside className={splashClasses}>
        <figure className='main' onClick={() => hideSplash()}>
          <Image src={splash.large} alt={splash.alt} width={'auto'} height={'100%'} objectFit='contain' />
          <figcaption>Enter the Site</figcaption>
        </figure>
      </aside>}
    </>
    
  )
}

export default Home;