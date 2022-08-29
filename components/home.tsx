import { Container, Image } from "@nextui-org/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, MediaItem, NodeEntity, SimpleTerm } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import SeoHead from "./layout/head";
import { useContext, useEffect, useState } from "react";
import { clearLocal, fromLocal, hasLocal, toLocal } from "../lib/localstore";
import NewsItemPreview from "./widgets/news-item-preview";
import VideoPreview from "./widgets/video-preview";
import ExhibitionPreview from "./widgets/exhibition-preview";
import labels from "../lib/labels";
import { buildConditionalClassNames } from "../lib/utils";
import { TopContext } from "../pages/_app";

const buildSplashClasses = (): string => {
  const hasSeenRef = hasLocal('splash-viewed');
  let hasSeen = false;
  if (hasSeenRef) {
    const stored = fromLocal('splash-viewed', 3600);
    if (!stored.expired) {
      hasSeen = stored.data === true || stored.data === 'true';
    }
  }
  return buildConditionalClassNames('splash-overlay', 'active', !hasSeen);
}

const Home: NextPage<BaseEntity> = (data: BaseEntity) => {
  const pageData = new CompoundPageDataSet(data);
  const context = useContext(TopContext);
  const { meta } = pageData;
  const [splashClasses, setSplashClasses] = useState('splash-overlay');
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
    if (context) {
      if (context.escaped) {
        hideSplash();
      }
    }
  }, [splashClasses, setSplashClasses, context]);
  return (
    <>
      <Head>
        <SeoHead meta={meta} />
      </Head>
      <Container {...containerProps} className="home-container">
        {hasCurrExhib && <section className='current-exhibition'><h3>{ labels.current_exhibition }</h3><ExhibitionPreview node={ currentExhibition } /></section>}
        <section className='news-previews column'>
          <h3>{labels.latest_news}</h3>
          {hasNews && <div className='news-items'>
            {newsItems.map((item: NodeEntity) => <NewsItemPreview key={['news', item.uuid].join('-')} node={item} />)}
          </div>}
          <h3 className='more-link'><Link href='/news'><a>More</a></Link></h3>
          <div className='artwork-links'>
            <h3 className='subtitle'>{labels.artworks}</h3>
            <h4 className='subtitle-link'><Link href='/tags'><a>{labels.related_artworks}</a></Link></h4>
            <h4 className='subtitle-link'><Link href='/artworks'><a>{ labels.all_artworks }</a></Link></h4>
          </div>
        </section>
        {hasVideos && <section className='video-previews column'>
          <h3 className='section-header'>{ labels.latest_videos }</h3>
          <div className='items'>
            {videos.map((item: NodeEntity) => <VideoPreview key={['video', item.uuid].join('-')} node={item} />)}
          </div>

        </section>}
        <p className="show-splash-link" onClick={() => showSplash()}>Show splash</p>
      </Container>
      {hasSplash && <aside className={splashClasses}>
        <figure className='main' onClick={() => hideSplash()}>
          <Image src={splash.large} alt={splash.alt} width={'auto'} height={'100%'} objectFit='contain' />
          <figcaption><span className='text-label upper'>{ labels.enter_site }</span><i className='icon icon-next-arrow-narrow'></i></figcaption>
        </figure>
      </aside>}
    </>
    
  )
}

export default Home;