import { Container, Image, Tooltip } from "@nextui-org/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, MediaItem, SimpleTerm } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import SeoHead from "./layout/head";
import { useEffect, useState } from "react";
import { clearLocal, fromLocal, hasLocal, toLocal } from "../lib/localstore";
import MediaFigure from "./widgets/media-figure";
import DateRange from "./widgets/date-range";

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
      <Container {...containerProps}>
        {hasCurrExhib && <article>
          <Link href={currentExhibition.path}>
            <a>
              <h3>{currentExhibition.title}</h3>
              <MediaFigure item={currentExhibition.firstImage} size='preview' width='auto' height='100%' />
              <p><DateRange item={currentExhibition.field_date_range} /></p>
              <p>{currentExhibition.summary}</p>
            </a>
          </Link>
        </article>}
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