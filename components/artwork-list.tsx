import { NextPage } from "next";
import Link from 'next/link';
import { useState, useEffect, useMemo } from "react";
import { BaseEntity, FilterOption, SlugNameNum, YearNum } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
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
import { MetaDataSet } from "../lib/ui-entity";


const filterOpts = [
  { key: 'all', name: 'All' },
  { key: 'year', name: 'Year' },
  { key: 'type', name: 'Type' }
];

const extractTagFromResults = (slugRef = '', items: NodeEntity[]) => {
  let tagName = '';
  if (notEmptyString(slugRef)) {
    const slug = slugRef.split('--').pop()!;
    tagName = slug.replace(/-/g, ' ');
    const node = items.find(n => n.field_tags instanceof Array && n.field_tags.some(tg => tg.slug === slug));
    if (node instanceof NodeEntity) {
      const tg: any = node.field_tags.find(tg => tg.slug === slug);
      if (tg instanceof Object) {
        tagName = tg.name;
      }
    }
  }
  return tagName;
}

const extractTypeFromList = (slug = '', items: SlugNameNum[]) => {
  let tagName = slug.replace(/-/g, ' ');
  const tg: any = items.find(tg => tg.slug === slug);
  if (tg instanceof Object) {
    tagName = tg.name;
  }
  return tagName;
}

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
  const [items, setItems] = useState<NodeEntity[]>([]);
  const [meta, setMeta] = useState(new MetaDataSet());
  const [showPaginator, setShowPaginator] = useState(false);
  const [contextualTitle, setContextualTitle] = useState('Artworks');
  const [filterMode, setFilterMode] = useState('all');
  const [hasItems, setHasItems] = useState(false);
  const emptyFigStyles = { width: 0, display: 'none' };
  const [hasYears, setHasYears] = useState(false)
  const [hasTypes, setHasTypes] = useState(false)
  const [years, setYears] = useState<YearNum[]>([]);
  const [types, setTypes] = useState<SlugNameNum[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [subPath, setSubPath] = useState('');
  const router = useRouter();
  
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
    const { items, total, meta, perPage } = pageData;
    const yearRefs = pageData.sets.has('years') ? pageData.sets.get('years') : [];
    if (yearRefs instanceof Array && yearRefs.length > 0) {
      setYears(yearRefs as YearNum[]);
      setHasYears(true);
    }
    const typeRefs = pageData.sets.has('types') ? pageData.sets.get('types') : [];
    setItems(items);
    setMeta(meta);
    if (typeRefs instanceof Array && typeRefs.length > 0) {
      setTypes(typeRefs as SlugNameNum[]);
      setHasTypes(true);
    }
    const currentPath = router.asPath.split('?').shift()!;
    const currentPathParts = currentPath?.substring(1).split('/');
    if (currentPathParts.length > 1) {
      setSubPath(currentPathParts[1]);
    }
    
    let fm = 'all';
    if (notEmptyString(subPath)) {
      if (isNumeric(subPath) && subPath.length === 4 && parseInt(subPath, 10) > 1950 && parseInt(subPath, 10) < 2100) {
        fm = 'year';
      } else {
        fm = subPath.startsWith('tag--') ? 'tag' : 'type';
      } 
    }
    if (fm !== 'all') {
      const titleParts = ['Artworks'];
      switch (fm) {
        case 'tag':
          titleParts.push(extractTagFromResults(subPath, items))
          break;
        case 'type':
          titleParts.push(extractTypeFromList(subPath, types))
          break;
        case 'year':
          titleParts.push(subPath);
          break;
      }
      setContextualTitle(titleParts.join(' | '));
    }
    setFilterMode(fm);
    setShowPaginator(total > 0 && total > perPage);
    setHasItems(items instanceof Array && items.length > 0);
    setFilterOptions(filterOpts.map((row, ri) => {
      const itemKey = ['filter-opt', row.key, ri].join('-');
      const selected = row.key === fm;
      const className = selected ? 'active' : 'inactive';
      return { ...row, itemKey, selected, className }
    }));
    setEmtyFigureHeight(document);
    setTimeout(() => {
      setEmtyFigureHeight(document);
    }, 500);
  }, [pageData, contextualTitle, setContextualTitle, subPath,setSubPath, router, types]);
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <nav className={navClassName(filterMode)}>
        <h1>{ contextualTitle }</h1>
        <ul 
          className='row filter-options'
      >
          {filterOptions.map(opt => <li onClick={() => changeFilterMode(opt.key)} key={opt.itemKey} className={opt.className}>{opt.name}</li>)}
      </ul>
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
              <p>{item.typeYearLabel}</p>
              <p>{item.tagList}</p>
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