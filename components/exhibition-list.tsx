import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
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
import { setTempLocalBool, tempLocalBool } from "../lib/localstore";
import { loadMore } from "../lib/load-more";
import { getScrollTop } from "../lib/dom";
import labels from "../lib/labels";
import contentTypes from "../lib/content-types";

const ExhibitionList: NextPage<BaseEntity> = (data) => {  
  const pageData = useMemo(() => new PageDataSet(data), [data]);
  const hasItems = pageData.items.length > 0;
  const context = useContext(TopContext);
  const [scrollPage, setScrollPage] = useState(pageData.page);
  const isLarge = isMinLargeSize(context);
  const maxScrollPages = isLarge ? numScrollBatches.large : numScrollBatches.standard;
  const [scrollLoadPos, setScrollLoadPos] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { items, meta, total, perPage } = pageData;

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
  }, [pageData, maxScrollPages, router])

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
    window.addEventListener('scroll', onScroll);
    if (pageData.loadedPages < 2 && pageData.numPages > 1) {
      setTimeout(fetchMoreItems, 500);
    }
    
    setTimeout(() => {
       resizeAllGridItems(document, window);
    }, 250);
    
  }, [pageData, loading,maxScrollPages, router,context, scrollLoadPos, scrollPage])
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="exhibition-list grid-list">
        <header className="section-header">
            <h1>{contentTypes.exhibition}</h1>
        </header>
        {hasItems && <><div className="columns">
          {items.map((item: NodeEntity, index) => <figure key={[item.uuid, index].join('-')} className='node'>
              <Link href={item.path} className="image-holder"><a className="image-link">
                {item.hasImage && <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} />}
                </a></Link>
              <figcaption>
                <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
              {item.hasTextField('placename') && <p className="place-name">{ item.field_placename }</p>}
                <p className="date-range"><DateRange item={item.field_date_range}  /></p>
              </figcaption>
          </figure>)}
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