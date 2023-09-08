import { NextPage } from "next";
import { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { BaseEntity, FilterOption, SlugNameNum, YearNum } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { filterNavClassName, isNumeric, mapFilterOption, matchFilterMode, notEmptyString, subNavClassName } from "../lib/utils";
import TypeLink from "./widgets/type-link";
import Head from "next/head";
import { Container } from "@nextui-org/react";
import SeoHead from "./layout/head";
import { containerProps, displayNone } from "../lib/styles";
import { getScrollTop } from "../lib/dom";
import { useRouter } from "next/router";
import { TopContext } from "../pages/_app";
import { setTempLocalBool, tempLocalBool } from "../lib/localstore";
import { isMinLargeSize, numScrollBatches } from "../lib/settings";
import ArtworkFigure from "./widgets/artwork-figure";
import { loadMore } from "../lib/load-more";
import YearNav from "./widgets/year-nav";
import { justifyRows, resetJustifiedRows } from "../lib/row-justify";
/* import { fetchFullNode } from "../lib/api-view-results";
import ArtworkInsert from "./widgets/artwork-insert"; */

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

const wrapperClasses = (showSelected = false) => {
  const cls = ['artworks-container listing-main'];
  if (showSelected) {
    cls.push('show-detailed');
  }
  return cls.join(' ');
}

const ArtworkList: NextPage<BaseEntity> = (data) => {  
  const pageData = useMemo(() => new PageDataSet(data), [data]);
  const { site } = pageData;
  const context = useContext(TopContext);
  const [scrollPage, setScrollPage] = useState(pageData.page);
  const isLarge = isMinLargeSize(context);
  const maxScrollPages = isLarge ? numScrollBatches.large : numScrollBatches.standard;
  const [scrollLoadPos, setScrollLoadPos] = useState(0);
  const [selected, setSelected] = useState<NodeEntity>(new NodeEntity());
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const isLloading = tempLocalBool('loading');
  const [loading, setLoading] = useState<boolean>(isLloading);
  //const [showPaginator, setShowPaginator] = useState(false);
  const [contextualTitle, setContextualTitle] = useState('Artworks');
  const [filterMode, setFilterMode] = useState('all');
  const [hasYears, setHasYears] = useState(false)
  const [hasTypes, setHasTypes] = useState(false)
  const [years, setYears] = useState<YearNum[]>([]);
  const [types, setTypes] = useState<SlugNameNum[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [subPath, setSubPath] = useState('');
  const [currWW, setCurrWW] = useState(0);
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
/* const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
}, [embla, setSelectedIndex]); */
  
  const loadNextPrev = useCallback((forward = true) => {
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
      pageData.page = nextPage;
    }
  }, [maxScrollPages, pageData, router]);

  useEffect(() => {
    const { items } = pageData;
    if (currWW < 20 && context?.width) {
      setCurrWW(context?.width as number);
    }
    const yearRefs = pageData.sets.has('years') ? pageData.sets.get('years') : [];
    if (yearRefs instanceof Array && yearRefs.length > 0) {
      const yearRows = yearRefs as YearNum[];
      yearRows.sort((a, b) => b.year - a.year);
      setYears(yearRows);
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
    
    const fm = matchFilterMode(subPath);
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
    setFilterOptions(filterOpts.map((row: FilterOption, ri: number) => mapFilterOption(row, ri, fm)));
    

    const fetchMoreItems = () => {
      setLoading(true);
      setTempLocalBool('loading', true);
      const nextPage = pageData.nextPageOffset;
      if (pageData.mayLoad(maxScrollPages) && nextPage > scrollPage) {
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
    if (selected.nid > 0) {
      window.location.hash = '#' + selected.path;
    }
    if (context) {
      if (context.escaped) {
        setShowDetail(false);
        setSelected(new NodeEntity());
        window.location.hash = '';
      }
    }
    const normaliseGrid = () => {
      justifyRows('artwork-list-container')
    }

    const onResize = () => {
      
      const cw = context?.width as number;
      const diff = cw > 20 ? Math.abs(cw - currWW) : 0;
      if (diff > 50) {
        setCurrWW(cw);
        resetJustifiedRows("artwork-list-container", normaliseGrid);
      }
    }
    setTimeout(normaliseGrid, 80);
    setTimeout(() => {
     setTempLocalBool('loading', false);
    }, 3000);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    if (pageData.loadedPages < 2 && pageData.numPages > 1) {
      setTimeout(fetchMoreItems, 500);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [pageData, contextualTitle, subPath, router, types, context, scrollPage, scrollLoadPos, loading, maxScrollPages, selected, currWW]);
 
  return <>
    <Head>
      <title>{pageData.meta.title}</title>
      <SeoHead meta={pageData.meta} />
    </Head>
    <Container {...containerProps} className={ wrapperClasses(showDetail) }>
      <nav className={filterNavClassName(filterMode)}>
        <h1>{ contextualTitle }</h1>
        <ul 
          className='row filter-options'
      >
          {filterOptions.map(opt => <li onClick={() => changeFilterMode(opt.key)} key={opt.itemKey} className={opt.className}>{opt.name}</li>)}
      </ul>
        {hasYears && <YearNav years={years} current={ subPath }  basePath='/artworks' />}
        {hasTypes && <ArtworkTypeNav types={types} current={ subPath }/>}
      </nav>
      <section className="artwork-list">
        {pageData.hasItems && <><div className="fixed-height-rows medium-height inner-captions"  id="artwork-list-container">
          {pageData.items.map((item, index) => item.duplicate ? <figure className='hidden' key={item.indexedKey(index)} style={displayNone}></figure> : <ArtworkFigure item={item} index={index} key={item.indexedKey(index)} />)}
          </div>
          {pageData.showListingNav && <nav className='listing-nav row'>
            {pageData.mayLoadPrevious && <span className='nav-link prev' title={pageData.prevPageOffset(maxScrollPages).toString()} onClick={() => loadNextPrev(false)}><i className='icon icon-prev-arrow-narrow prev'></i>{ site.label('load_newer', 'Back') }</span>}
            <span className='text-label' onClick={() => loadNextPrev(pageData.mayLoadMore)}>{pageData.listingInfo} </span>
            {pageData.mayLoadMore && <span className='nav-link next' title={pageData.nextPageOffset.toString()} onClick={() => loadNextPrev(true)}>{ site.label('load_older', 'Next')}<i className='icon icon-next-arrow-narrow next'></i></span>}
          </nav>}
        </>}
      </section>
    </Container>
  </>
}

export default ArtworkList;