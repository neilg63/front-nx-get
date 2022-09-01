import { NextPage } from "next";
import { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { BaseEntity, FilterOption, SlugNameNum, YearNum } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
//import Paginator from "./widgets/paginator";
import { isNumeric, notEmptyString } from "../lib/utils";
import TypeLink from "./widgets/type-link";
import YearLink from "./widgets/year-link";
import Head from "next/head";
import { Container } from "@nextui-org/react";
import SeoHead from "./layout/head";
import { containerProps, displayNone } from "../lib/styles";
import { getScrollTop, setEmtyFigureHeight } from "../lib/dom";
import { useRouter } from "next/router";
import { TopContext } from "../pages/_app";
import { setTempLocalBool, tempLocalBool } from "../lib/localstore";
import labels from "../lib/labels";
import { isMinLargeSize, numScrollBatches } from "../lib/settings";
import ArtwworkFigure from "./widgets/artwork-figure";
import { loadMore } from "../lib/load-more";


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
  //const pageData = new PageDataSet(data);
  const context = useContext(TopContext);
  const [scrollPage, setScrollPage] = useState(pageData.page);
  const isLarge = isMinLargeSize(context);
  const maxScrollPages = isLarge ? numScrollBatches.large : numScrollBatches.standard;
  const [scrollLoadPos, setScrollLoadPos] = useState(0);
  const isLloading = tempLocalBool('loading');
  const [loading, setLoading] = useState<boolean>(isLloading);
  //const [showPaginator, setShowPaginator] = useState(false);
  const [contextualTitle, setContextualTitle] = useState('Artworks');
  const [filterMode, setFilterMode] = useState('all');
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

  const loadNextPrev = (forward = true) => {
    const currPath = router.asPath.split('?').shift();
    const nextPage = forward ? pageData.nextPageOffset : pageData.prevPageOffset(maxScrollPages);
    if (pageData.mayLoad(maxScrollPages) && forward) {
      setTempLocalBool('loading', true);
      setLoading(true);
      loadMore(router.asPath, nextPage).then((items: NodeEntity[]) => {
        pageData.addItems(items);
        setLoading(false);
        setTimeout(() => {
          setTempLocalBool('loading', false);
        }, 500);
      });
    } else {
      const nextPageNum = nextPage + 1;
      router.push(currPath + '?page=' + nextPageNum);
    }
  }

  const loadNext = () => {
    loadNextPrev(true);
  }

  const loadPrev = () => {
    loadNextPrev(false);
  }

  useEffect(() => {
    const { items } = pageData;
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
    //setShowPaginator(total > 0 && total > perPage && scrollPage < 2);
    setFilterOptions(filterOpts.map((row, ri) => {
      const itemKey = ['filter-opt', row.key, ri].join('-');
      const selected = row.key === fm;
      const className = selected ? 'active' : 'inactive';
      return { ...row, itemKey, selected, className }
    }));
    setEmtyFigureHeight(document);

    const fetchMoreItems = () => {
      setLoading(true);
      setTempLocalBool('loading', true);
      const nextPage = pageData.nextPageOffset;
      if (pageData.mayLoad(maxScrollPages)) {
        setScrollPage(nextPage);
        loadMore(router.asPath, nextPage).then((items: NodeEntity[]) => {
          pageData.addItems(items);
          setTimeout(() => {
            setLoading(false);
            setTempLocalBool('loading', false);
          }, 500);
        });
      }
    }

    const onScroll = () => {
       const st = getScrollTop();
      const isLoading = loading || tempLocalBool('loading');
       if (context && !isLoading && scrollPage < pageData.numPages) {
         const relPage = scrollPage - pageData.page;
          const divisor = scrollPage < 2 ? 5 : relPage < 3 ? 4 : 3;
          const stopVal = context.height / divisor;
          const targetVal = scrollLoadPos + stopVal;
         if (st > targetVal) {
            setScrollLoadPos(st);
            fetchMoreItems();
         } else if (st < scrollLoadPos) {
           setScrollLoadPos(st); 
          }
       }
    };
    setTimeout(() => {
     setEmtyFigureHeight(document);
    }, 500);
    setTimeout(() => {
     setTempLocalBool('loading', false);
    }, 3000);
    window.addEventListener('scroll', onScroll);
    if (pageData.loadedPages < 2 && pageData.numPages > 1) {
      setTimeout(fetchMoreItems, 500);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [pageData, contextualTitle, subPath, router, types, context, scrollPage, scrollLoadPos, loading, maxScrollPages]);
  return <>
    <Head>
      <SeoHead meta={pageData.meta} />
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
        {pageData.hasItems && <><div className="flex-rows-6">
          {pageData.items.map((item, index) => item.duplicate ? <figure className='hidden' key={item.indexedKey(index)} style={displayNone}></figure> : <ArtwworkFigure item={item} index={ index } key={item.indexedKey(index)} />)}
          <figure className="empty-figure" style={ emptyFigStyles }></figure>
          </div>
          {pageData.showListingNav && <nav className='listing-nav row'>
            {pageData.mayLoadPrevious && <span className='nav-link prev' title={pageData.nextPageOffset.toString()} onClick={() => loadPrev()}><i className='icon icon-prev-arrow-narrow prev'></i>{ labels.load_newer}</span>}
            <span className='text-label' onClick={() => loadNextPrev(pageData.mayLoadMore)}>{pageData.listingInfo} </span>
            {pageData.mayLoadMore && <span className='nav-link next' title={pageData.nextPageOffset.toString()} onClick={() => loadNext()}>{ labels.load_older}<i className='icon icon-next-arrow-narrow next'></i></span>}
          </nav>}
        </>}
      </section>
    </Container>
  </>
}

export default ArtworkList;