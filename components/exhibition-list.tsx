import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity, FilterOption, YearNum } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import SeoHead from "./layout/head";
import { Container, Image } from "@nextui-org/react";
import { addEndClasses, containerProps } from "../lib/styles";
import DateRange from "./widgets/date-range";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Router, useRouter } from "next/router";
import { isMinLargeSize, numScrollBatches } from "../lib/settings";
import { TopContext } from "../pages/_app";
import { loadMore } from "../lib/load-more";
import { getScrollTop } from "../lib/dom";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import YearNav from "./widgets/year-nav";
import { filterNavClassName, mapFilterOption, matchFilterMode, notEmptyString } from "../lib/utils";
import { smartJustify, smartResetJustified } from "../lib/row-justify";

const filterOpts = [
  { key: 'all', name: 'All' },
  { key: 'year', name: 'Year' },
  { key: 'solo', name: 'Solo' },
  { key: 'group', name: 'Group' }
];

const ExhibitionList: NextPage<BaseEntity> = (data) => {  
  const pageData = useMemo(() => new PageDataSet(data), [data]);
  const { site } = pageData;
  const hasItems = pageData.items.length > 0;
  const context = useContext(TopContext);
  const [scrollPage, setScrollPage] = useState(pageData.page);
  const isLarge = isMinLargeSize(context);
  const maxScrollPages = isLarge ? numScrollBatches.large : numScrollBatches.standard;
  const [scrollLoadPos, setScrollLoadPos] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState('all');
  const [subPath, setSubPath] = useState('');
  const [currWW, setCurrWW] = useState(0);
  const router = useRouter();
  const { items, meta, sets } = pageData;
  const years = sets.has('years') ? sets.get('years') as YearNum[]: [];
  const hasYears = years instanceof Array && years.length > 0;
  
  const loadNextPrev = useCallback((forward = true) => {
    const currPath = router.asPath.split('?').shift();
    const nextPage = forward ? pageData.nextPageOffset : pageData.prevPageOffset(maxScrollPages);
    const mayLoadMore = pageData.mayLoad(maxScrollPages);
    const loadMoreMode = mayLoadMore && forward;
    if (loadMoreMode) {
      setLoading(true);
      loadMore(router.asPath, nextPage).then((items: NodeEntity[]) => {
        pageData.addItems(items);
        setLoading(false);
      });
    } else {
      const nextPageNum = nextPage + 1;
      router.push(currPath + '?page=' + nextPageNum);
    }
  }, [pageData, maxScrollPages, router]);

  const changeFilterMode = useCallback((mode: string) => {
    const currPath = router.asPath.split('?').shift() as string;
    switch (mode) {
      case 'solo':
      case 'group':
        router.push(['/exhibitions', mode].join('/'));
        break;
      case 'all':
      case 'year':
        if (/(exhibitions)$/.test(currPath) === false) {
          const qStr = mode === 'year'? '?mode=year' : '';
          router.push('/exhibitions' + qStr);
        }
        break;
    }
    setFilterMode(mode);
    setTimeout(() => {
      setFilterOptions(filterOpts.map((row: FilterOption, ri: number) => mapFilterOption(row, ri, mode)));
    }, 50);
  }, [router, setFilterMode, setFilterOptions]);

  useEffect(() => {
    const fetchMoreItems = () => {
      setLoading(true);
        const nextPage = pageData.nextPageOffset;
        const isLarge = isMinLargeSize(context);
        const max = isLarge ? numScrollBatches.large : numScrollBatches.standard;
        if (pageData.mayLoad(max)) {
          setScrollPage(nextPage);
          loadMore(router.asPath, nextPage).then((items: NodeEntity[]) => {
            pageData.addItems(items, true);
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          });
        }
    }

    const onScroll = () => {
       const st = getScrollTop();
       const isLoading = loading;
      if (context && !isLoading && scrollPage < pageData.numPages) {
         const relPage = scrollPage - pageData.page;
          const divisor = scrollPage < 2 ? 4 : relPage < 3 ? 3.2 : 2.5;
          const stopVal = context.height / divisor;
          const targetVal = scrollLoadPos + stopVal;
         if (st > targetVal) {
            setScrollLoadPos(st);
            fetchMoreItems();
         } else if (st < scrollLoadPos) {
           setScrollLoadPos(st); 
         }
       }
       return () => {
        window.removeEventListener('scroll', onScroll);
      }
    };
    const currentPath = router.asPath.split('?').shift()!;
    
    const currentPathParts = currentPath?.substring(1).split('/');
    const sp = notEmptyString(router.query.mode, 3) ? router.query.mode as string : currentPathParts.length > 1 ? currentPathParts[1] : '';
    if (sp.length > 1) {
      setSubPath(sp);
    }
    const fm = matchFilterMode(subPath);
    setFilterMode(fm);
    setFilterOptions(filterOpts.map((row: FilterOption, ri: number) => mapFilterOption(row, ri, fm)));

    window.addEventListener('scroll', onScroll);
    if (pageData.loadedPages < 2 && pageData.numPages > 1) {
      setTimeout(fetchMoreItems, 500);
    }
    const normaliseGrid = () => {
      smartJustify("exhibition-list-container", window);
      
    }
    setTimeout(normaliseGrid, 80);
    const onResize = () => {
      
      const cw = context?.width as number;
      const diff = cw > 20 ? Math.abs(cw - currWW) : 0;
      if (diff > 50) {
        setCurrWW(cw);
        smartResetJustified("exhibition-list-container", window, normaliseGrid);
      }
    }
    const adjustGridRows = () => {
      setTimeout(normaliseGrid, 100);
    }
    window.addEventListener('resize', onResize);
    Router.events.on('routeChangeComplete', adjustGridRows);
    setTimeout(() => {
      addEndClasses(document)
    }, 200);
    addEndClasses(document)
    return () => {
      window.removeEventListener('resize', onResize);
      Router.events.off('routeChangeComplete', adjustGridRows);
    }
  }, [pageData, maxScrollPages, loading, router,context, scrollLoadPos, scrollPage, subPath, currWW, setCurrWW])
  return  <>
    <SeoHead meta={meta} />
    <Container {...containerProps}>
      <section className="exhibition-list grid-list">
        <nav className={filterNavClassName(filterMode)}>
          <h1 className='breadcrumb-title'><BreadcrumbTitle path={pageData.meta.path} title={pageData.contextTitle} /></h1>
          <ul className='row filter-options'>
            {filterOptions.map(opt => <li onClick={() => changeFilterMode(opt.key)} key={opt.itemKey} className={opt.className}>{opt.name}</li>)}
          </ul>
          {hasYears && <YearNav years={years} current={ meta.endPath } basePath='/exhibitions' />}
        </nav>
        {hasItems && <><div className="fixed-height-rows tall-height" id="exhibition-list-container">
          {items.map((item: NodeEntity, index) => <figure key={[item.uuid, index].join('-')} className='node'>
              <Link href={item.path} className="image-holder"><a className="image-link"  style={item.firstImage.calcAspectStyle()}>
                {item.hasImage ? <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} /> : <div className='frame'></div>}
                <figcaption>
                <h3>{item.title}</h3>
              {item.hasPlacename && <p className="placename">{ item.field_placename }</p>}
                <p className="date-range"><DateRange item={item.field_date_range}  /></p>
              </figcaption>  
              </a></Link>
              
          </figure>)}
              <figure className="last-item"></figure>
          </div>
          {pageData.showListingNav && <nav className='listing-nav row'>
            {pageData.mayLoadPrevious && <span className='nav-link prev' title={pageData.prevPageOffset(maxScrollPages).toString()} onClick={() => loadNextPrev(false)}><i className='icon icon-prev-arrow-narrow prev'></i>{ site.label('load_newer')}</span>}
            <span className='text-label' onClick={() => loadNextPrev(pageData.mayLoadMore)}>{pageData.listingInfo} </span>
            {pageData.mayLoadMore && <span className='nav-link next' title={pageData.nextPageOffset.toString()} onClick={() => loadNextPrev(true)}>{ site.label('load_older')}<i className='icon icon-next-arrow-narrow next'></i></span>}
          </nav>}
        </>}
      </section>
    </Container>
  </>
}

export default ExhibitionList;