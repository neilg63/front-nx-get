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
import { useRouter } from "next/router";
import { globalPagePaths } from "../lib/settings";
import { addBodyClass, removeBodyClass } from "../lib/dom";

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
  const router: any = useRouter();

  const { meta } = pageData;
  const [splashClasses, setSplashClasses] = useState('splash-overlay');
  const [enableOverlay, setEnableOverlay] = useState(false);
  const splashItems = pageData.getMediaItems('splash');
  const numItems = splashItems instanceof Array ? splashItems.length : 0;
  const randIndex = Math.floor(Math.random() * 0.999999 * numItems);
  const splash = numItems > 0 ? splashItems[randIndex] : new MediaItem();
  const hasSplash = enableOverlay && numItems > 0;
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
    setSplashClasses('splash-overlay active');
  }

  useEffect(() => {
    setSplashClasses(buildSplashClasses());
    if (splashClasses.includes('active') && enableOverlay) {
      addBodyClass(document, 'show-fullscreen-overlay');
    } else {
      removeBodyClass(document, 'show-fullscreen-overlay');
    }
    if (context) {
      if (context.escaped) {
        hideSplash();
      }
    }
      if (router.components instanceof Object) {
      const hasReferrers = Object.keys(router.components).some(p => globalPagePaths.includes(p) === false);
      setEnableOverlay(!hasReferrers);
    }
  }, [splashClasses, context, enableOverlay, router]);
  return (
    <>
      <Head>
        <SeoHead meta={meta} />
      </Head>
      <Container {...containerProps} className="home-container">
        <header className="home-header section-header"><i className='icon icon-home'></i></header>
        {hasCurrExhib && <section className='current-exhibition'><ExhibitionPreview node={ currentExhibition } /></section>}
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