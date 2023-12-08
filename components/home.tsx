import { Container, Image } from "@nextui-org/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, MediaItem, NodeEntity } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import SeoHead from "./layout/head";
import { useContext, useEffect, useRef, useState } from "react";
import { clearLocal, fromLocal, hasLocal, toLocal } from "../lib/localstore";
import NewsItemPreview from "./widgets/news-item-preview";
import VideoPreview from "./widgets/video-preview";
import ExhibitionPreview from "./widgets/exhibition-preview";
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
  const initialised = useRef(false);
  const router: any = useRouter();
  const { meta, labels, site } = pageData;
  const [splashClasses, setSplashClasses] = useState('splash-overlay');
  const [enableOverlay, setEnableOverlay] = useState(false);
  const [activeExibitionIndex, setActiveExibitionIndex] = useState(0);
  const [currentExhibStyles, setCurrentExhibStyles] = useState({ });
  const currentExhibIntervalId = useRef(0); 
  const splashItems = pageData.getMediaItems('splash');
  const numItems = splashItems instanceof Array ? splashItems.length : 0;
  const randIndex = Math.floor(Math.random() * 0.999999 * numItems);
  const splash = numItems > 0 ? splashItems[randIndex] : new MediaItem();
  const hasSplash = enableOverlay && numItems > 0;
  let hasCurrExhibs = pageData.widgets.has('current_exhibitions')
  const currentExhibitions = hasCurrExhibs ? pageData.getEntities('current_exhibitions') : [];
  const numCurrentExhibitions = currentExhibitions.length;
  hasCurrExhibs = currentExhibitions.length > 0;
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
    setSplashClasses('splash-overlay active show-again');
  }
  useEffect(() => {
    if (!splashClasses.includes('show-again')) {
      setSplashClasses(buildSplashClasses());
    }
    if (splashClasses.includes('active') && enableOverlay) {
      addBodyClass(document, 'show-fullscreen-overlay');
    } else {
      removeBodyClass(document, 'show-fullscreen-overlay');
    }
    const calcExhibitionStyles = () => {
      const els = document.querySelectorAll('.current-exhibition > .nodes > article');
      let height = 0;
      for (const el of els) {
        if (el instanceof HTMLElement) {
          const rect = el.getBoundingClientRect();
          if (rect.height) {
            if (rect.height > height) {
              height = rect.height;
            }
          }
        }
      }
      if (height > 200) {
        setCurrentExhibStyles({height: `${height}px`});
      }
    }

    if (context) {
      if (context.escaped) {
        hideSplash();
      }
    }
    
    if (router.components instanceof Object) {
      const hasReferrers = Object.keys(router.components).some(p => globalPagePaths.includes(p) === false);
      const enableOverlay = !hasReferrers || splashClasses.includes('show-again');
      setEnableOverlay(enableOverlay);
    }

    if (!initialised.current) {
      setTimeout(calcExhibitionStyles, 125);
    }
    
    currentExhibIntervalId.current = window.setInterval(() => {
      const nextIndex = (activeExibitionIndex + 1) % numCurrentExhibitions;
      setActiveExibitionIndex(nextIndex)
      calcExhibitionStyles();
    }, 3000);
    return () => {
      clearInterval(currentExhibIntervalId.current);
      initialised.current = true;
    }
  }, [splashClasses, context, enableOverlay, router, activeExibitionIndex, setActiveExibitionIndex, numCurrentExhibitions,setCurrentExhibStyles, currentExhibIntervalId]);
  return (
    <>
      <SeoHead meta={meta} />
      <Container {...containerProps} className="home-container">
        <section className='current-exhibition'>
          <header className="home-header section-header"><i className='icon icon-home show-splash-trigger' onClick={() => showSplash()}></i></header>
          {hasCurrExhibs && <div className="nodes" style={currentExhibStyles}>
            {currentExhibitions.map((exhib, ei) => <ExhibitionPreview node={exhib} label={labels.get('current_exhibition')} key={['current-exhibitions', ei].join('-')} active={ei === activeExibitionIndex}  />)}  
          </div>}
        </section>
        <section className='news-previews column'>
          <h3>{labels.get('latest_news')}</h3>
          {hasNews && <div className='news-items'>
            {newsItems.map((item: NodeEntity) => <NewsItemPreview key={['news', item.uuid].join('-')} node={item} />)}
          </div>}
          <h3 className='more-link'><Link href='/news'><a>{ site.label('see_more', 'See More') }</a></Link></h3>
          <div className='artwork-links'>
            <h3 className='subtitle'>{labels.get('artworks')}</h3>
            <h4 className='subtitle-link'><Link href='/tags'><a>{labels.get('related_artworks')}</a></Link></h4>
            <h4 className='subtitle-link'><Link href='/artworks'><a>{ labels.get('all_artworks') }</a></Link></h4>
          </div>
        </section>
        {hasVideos && <section className='video-previews column'>
          <h3 className='section-header'>{ labels.get('latest_videos') }</h3>
          <div className='items'>
            {videos.map((item: NodeEntity) => <VideoPreview key={['video', item.uuid].join('-')} node={item} />)}
          </div>
        </section>}
        <p className="show-splash-link" onClick={() => showSplash()}>💦</p>
      </Container>
      {hasSplash && <aside className={splashClasses}>
        <figure className='main' onClick={() => hideSplash()}>
          <Image src={splash.best} alt={splash.alt} width={'auto'} height={'100%'} objectFit='cover' />
          <figcaption><span className='text-label upper'>{ labels.get('enter_site') }</span><i className='icon icon-next-arrow-narrow'></i></figcaption>
        </figure>
      </aside>}
    </>
    
  )
}

export default Home;