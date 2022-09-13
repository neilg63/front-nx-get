import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity, FilterOption, YearNum } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container, Image } from "@nextui-org/react";
import { containerProps, resizeAllGridItems } from "../lib/styles";
import DateRange from "./widgets/date-range";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { isMinLargeSize, numScrollBatches } from "../lib/settings";
import { TopContext } from "../pages/_app";
import { loadMore } from "../lib/load-more";
import { getScrollTop, setEmtyFigureHeight } from "../lib/dom";
import labels from "../lib/labels";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import YearNav from "./widgets/year-nav";
import { filterNavClassName, isNumeric, mapFilterOption, matchFilterMode, notEmptyString } from "../lib/utils";

const filterOpts = [
  { key: 'all', name: 'All' },
  { key: 'year', name: 'Year' }
];

const ExhibitionList: NextPage<BaseEntity> = (data) => {  
  const pageData = useMemo(() => new PageDataSet(data), [data]);
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
  const router = useRouter();
  const { items, meta, sets } = pageData;
  const years = sets.has('years') ? sets.get('years') as YearNum[]: [];
  const hasYears = years instanceof Array && years.length > 0;
  const emptyFigStyles = { width: 0, display: 'none' };
  
  const loadNextPrev = useCallback((forward = true) => {
    const currPath = router.asPath.split('?').shift();
    const nextPage = forward ? pageData.nextPageOffset : pageData.prevPageOffset(maxScrollPages);
    if (pageData.mayLoad(maxScrollPages) && forward) {
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
    setFilterMode(mode);
  }, [])

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
    if (currentPathParts.length > 1) {
      setSubPath(currentPathParts[1] )
    }

    const fm = matchFilterMode(subPath);
    setFilterMode(fm);
    setFilterOptions(filterOpts.map((row: FilterOption, ri: number) => mapFilterOption(row, ri, fm)));

    window.addEventListener('scroll', onScroll);
    if (pageData.loadedPages < 2 && pageData.numPages > 1) {
      setTimeout(fetchMoreItems, 500);
    }
    window.addEventListener("resize", () => {
      setEmtyFigureHeight(document);
    });
    setTimeout(() => { 
      setEmtyFigureHeight(document);
    }, 250);
  }, [pageData, loading, maxScrollPages, router,context, scrollLoadPos, scrollPage, subPath])
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="exhibition-list grid-list">
        <nav className={filterNavClassName(filterMode)}>
            <h1><BreadcrumbTitle path={pageData.meta.path} title={pageData.contextTitle} /></h1>
            <ul className='row filter-options'>
            {filterOptions.map(opt => <li onClick={() => changeFilterMode(opt.key)} key={opt.itemKey} className={opt.className}>{opt.name}</li>)}
        </ul>
          {hasYears && <YearNav years={years} current={ meta.endPath } basePath='/exhibitions' />}
        </nav>
        {hasItems && <><div className="fixed-height-rows tall-height">
          {items.map((item: NodeEntity, index) => <figure key={[item.uuid, index].join('-')} className='node'>
              <Link href={item.path} className="image-holder"><a className="image-link"  style={item.firstImage.calcAspectStyle()}>
                {item.hasImage ? <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} /> : <div className='frame'></div>}
                <figcaption>
                <h3>{item.title}</h3>
              {item.hasTextField('placename') && <p className="place-name">{ item.field_placename }</p>}
                <p className="date-range"><DateRange item={item.field_date_range}  /></p>
              </figcaption>  
              </a></Link>
              
          </figure>)}
             <figure className="empty-figure" style={ emptyFigStyles }></figure>
          </div>
          {pageData.showListingNav && <nav className='listing-nav row'>
            {pageData.mayLoadPrevious && <span className='nav-link prev' title={pageData.prevPageOffset(maxScrollPages).toString()} onClick={() => loadNextPrev(false)}><i className='icon icon-prev-arrow-narrow prev'></i>{ labels.load_newer}</span>}
            <span className='text-label' onClick={() => loadNextPrev(pageData.mayLoadMore)}>{pageData.listingInfo} </span>
            {pageData.mayLoadMore && <span className='nav-link next' title={pageData.nextPageOffset.toString()} onClick={() => loadNextPrev(true)}>{ labels.load_older}<i className='icon icon-next-arrow-narrow next'></i></span>}
          </nav>}
        </>}
      </section>
    </Container>
  </>
}

export default ExhibitionList;