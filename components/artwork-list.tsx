import { NextPage } from "next";
import Link from 'next/link';
import { useState, useEffect, useMemo } from "react";
import { BaseEntity, SlugNameNum, YearNum } from "../lib/interfaces";
import { PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import TagList from "./widgets/tag-list";
import Image from "next/image";
import { defaultImageLoader, isNumeric, notEmptyString } from "../lib/utils";
import TypeLink from "./widgets/type-link";
import YearLink from "./widgets/year-link";
import Head from "next/head";
import { Container, Radio } from "@nextui-org/react";
import SeoHead from "./layout/head";
import { containerProps } from "../lib/styles";
import { setEmtyFigureHeight } from "../lib/dom";
import { useRouter } from "next/router";



const navClassName = (mode: string): string => {
  return ['filter-nav', ['show-by', mode].join('-')].join(' ');
}

const subNavClassName = (current: string, refVal: string | number): string => {
  const compStr = typeof refVal === "string" ? refVal : refVal.toString();
  return current === compStr ? 'active' : 'inactive';
}

const ArtworkYearNav = ({ years, current }: { years: YearNum[], current: string }) => {
  const basePath = '/artworks/';
  return (
    <ul className='sub-nav years-nav row'>
      {years.map((item, index) => <li key={['year', item.year, index].join('-')} className={ subNavClassName(current, item.year)}>
        <YearLink value={ item.year } basePath={basePath} />
      </li>)}
    </ul>
  );
}

const ArtworkTypeNav = ({ types, current }: { types: SlugNameNum[], current: string }) => {
  const basePath = '/artworks/';
  return (
    <ul className='sub-nav types-nav row'>
      {types.map((item, index) => <li key={['type', item.slug, index].join('-')} className={ subNavClassName(current, item.slug)}>
        <TypeLink value={ item } basePath={basePath} />
      </li>)}
    </ul>
  );
}

const ArtworkList: NextPage<BaseEntity> = (data) => {  
  const pageData = useMemo(() => new PageDataSet(data), [data]);
  const { items, meta } = pageData;
  const [showPaginator, setShowPaginator] = useState(false);
  const [filterMode, setFilterMode] = useState('all');
  const [hasItems, setHasItems] = useState(false)
  const basePath = '/artworks/';
  const emptyFigStyles = { width: 0, display: 'none' };
  const [hasYears, setHasYears] = useState(false)
  const [hasTypes, setHasTypes] = useState(false)
  const [years, setYears] = useState<YearNum[]>([]);
  const [types, setTypes] = useState<SlugNameNum[]>([]);
  const router = useRouter();
  const currentPath = router.asPath.split('?').shift()!;
  const currentPathParts = currentPath?.substring(1).split('/');
  const subPath = currentPathParts.length > 1 ? currentPathParts[1] : '';
  const changeFilterMode = (mode: string) => {
    setFilterMode(mode);
    if (mode === 'all') {
      const currPath = router.asPath.split('?').shift();
      if (currPath !== '/artworks') {
        router.push('/artworks');
      }
    }
  }

  useEffect(() => {
    const { items, total, perPage } = pageData;
    const yearRefs = pageData.sets.has('years') ? pageData.sets.get('years') : [];
    if (yearRefs instanceof Array && yearRefs.length > 0) {
      setYears(yearRefs as YearNum[]);
      setHasYears(true);
    }
    const typeRefs = pageData.sets.has('types') ? pageData.sets.get('types') : [];
    
    if (typeRefs instanceof Array && typeRefs.length > 0) {
      setTypes(typeRefs as SlugNameNum[]);
      setHasTypes(true);
    }
    let fm = 'all';
    if (notEmptyString(subPath)) {
      if (isNumeric(subPath) && subPath.length === 4 && parseInt(subPath, 10) > 1950 && parseInt(subPath, 10) < 2100) {
        fm = 'year';
      } else if (subPath.startsWith('tag--') === false) {
        fm = 'type';
      }
    }
    setFilterMode(fm);
    setShowPaginator(total > 0 && total > perPage);
    setHasItems(items instanceof Array && items.length > 0);
    setEmtyFigureHeight(document);
    setTimeout(() => {
      setEmtyFigureHeight(document);
    }, 500);
  }, [pageData, subPath]);
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <nav className={navClassName(filterMode)}>
        <Radio.Group 
        label="Options"
          value={filterMode}
          size='sm'
          className='row'
        onChange={changeFilterMode}
      >
        <Radio value="all">All</Radio>
        <Radio value="year">Year</Radio>
        <Radio value="type">Type</Radio>
      </Radio.Group>
        {hasYears && <ArtworkYearNav years={years} current={ subPath }  />}
        {hasTypes && <ArtworkTypeNav types={types} current={ subPath }/>}
      </nav>
      <section className="artwork-list">
        {hasItems && <><div className="flex-rows-6">
          {items.map(item => <figure key={item.uuid} style={item.firstImage.calcAspectStyle()} className='node'>
            <Link href={item.path} className="image-holder"><a className="image-link" title={ item.numMediaLabel }>
                {item.hasImage && <Image loader={defaultImageLoader} src={item.firstImage.preview} alt={item.alt} width={item.firstImage.calcWidth('preview')} height={item.firstImage.calcHeight('preview')} objectFit='contain' layout='intrinsic' />}
                </a></Link>
              <figcaption>
               <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
                <TagList terms={item.field_tags} base='/artworks' prefix='tag' />
                <TypeLink value={item.field_type} basePath={basePath} />
                <YearLink value={item.field_year} basePath={basePath} />
              </figcaption>
            </figure>)}
          <figure className="empty-figure" style={ emptyFigStyles }></figure>
          </div>
          {showPaginator && <Paginator pageData={pageData} maxLinks={8} />}
        </>}
      </section>
    </Container>
  </>
}

export default ArtworkList;