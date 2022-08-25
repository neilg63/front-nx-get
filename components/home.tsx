import { Container, Image, Tooltip } from "@nextui-org/react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BaseEntity } from "../lib/interfaces";
import { CompoundPageDataSet, MediaItem, SimpleTerm } from "../lib/entity-data";
import { containerProps } from "../lib/styles";
import SeoHead from "./layout/head";

const numRelatedLabel = (numRelated = 0) => {
  const pl = numRelated === 1 ? '' : 's';
  return numRelated > 0? `${numRelated} related artwork${pl}` : '';
}

const toKey = (prefix = '', slug = '') => {
  return [prefix, slug].join('-');
}

const Home: NextPage<BaseEntity> = (data: BaseEntity) => {
  const pageData = new CompoundPageDataSet(data);
  const { meta } = pageData;
  const tags = pageData.getWidgetTerms('tags');
  const splashItems = pageData.getMediaItems('splash');
  const numItems = splashItems instanceof Array ? splashItems.length : 0;
  const randIndex = Math.floor(Math.random() * 0.999999 * numItems);
  const splash = numItems > 0 ? splashItems[randIndex] : new MediaItem();
  const hasSplash = numItems > 0;
  return (
    <>
      <Head>
        <SeoHead meta={meta} />
      </Head>
      <Container {...containerProps}>
        {hasSplash && <figure><Image src={splash.preview} alt={splash.alt} width={'auto'} height={'100%'} objectFit='contain' /></figure>}
        <ul className="tag-list">
        {tags.map((item: SimpleTerm) => {
          return <li date-key={ toKey('tag', item.slug) }  key={toKey('tag', item.slug)}>
              <Tooltip content={numRelatedLabel(item.num_related)} rounded={false} shadow={false} className='bordered'><Link href={item.path}><a>{item.title}</a></Link></Tooltip>
            </li>
          })}
        </ul>
      </Container>
    </>
    
  )
}

export default Home;