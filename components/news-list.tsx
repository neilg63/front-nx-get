import { NextPage } from "next";
import Link from 'next/link';
import { Router } from "next/router";
import { BaseEntity, YearNum } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { shortDate } from "../lib/converters";
import { Container, Image } from "@nextui-org/react";
import { addEndClasses, containerProps } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";
import React, { useContext, useEffect, useMemo, useState } from "react";
import LoadMoreNav from "./widgets/load-more-nav";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import YearNav from "./widgets/year-nav";
import { justifyRows, resetJustifiedRows } from "../lib/row-justify";
import { AppContextInterface } from "../pages/_app";

export const TopContext = React.createContext<AppContextInterface | null>(null);

const NewsList: NextPage<BaseEntity> = (data) => { 
  const [currWW, setCurrWW] = useState(0);
  const context = useContext(TopContext);
  const pageData = useMemo(() => new PageDataSet(data), [data]);
  const { items, meta, total, perPage, sets } = pageData;
  const years = sets.has('years') ? sets.get('years') as YearNum[]: [];
  const hasYears = years instanceof Array && years.length > 0;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  const subPath = meta.endPath;
  useEffect(() => {
    if (currWW < 20 && context?.width) {
      setCurrWW(context?.width as number);
    }
    setTimeout(() => {
      addEndClasses(document)
    }, 200);
    addEndClasses(document)
    const normaliseGrid = () => {
      justifyRows('news-list-container')
    }
    setTimeout(normaliseGrid, 80);
    const onResize = () => {
      
      const cw = context?.width as number;
      const diff = cw > 20 ? Math.abs(cw - currWW) : 0;
      if (diff > 50) {
        setCurrWW(cw);
        resetJustifiedRows("news-list-container", normaliseGrid);
      }
    }
    const adjustGridRows = () => {
      setTimeout(normaliseGrid, 100);
    }
    window.addEventListener('resize', onResize);
    Router.events.on('routeChangeComplete', adjustGridRows);
    return () => {
      window.removeEventListener('resize', onResize);
      Router.events.off('routeChangeComplete', adjustGridRows);
    };
  },[context, currWW, setCurrWW]);
  return <>
    <Head>
      <title>{meta.title}</title>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='listing-main'>
      <nav className='filter-nav show-by-year'>
        <h1 className='breadcrumb-title'><BreadcrumbTitle path={pageData.meta.path} title={ pageData.contextTitle } /></h1>
        {hasYears && <YearNav years={years} current={ subPath } basePath='/news' />}
      </nav>
      <section className="news-list grid-list">
        {hasItems && <><div className="fixed-height-rows tall-height" id="news-list-container">
          {items.map((item: NodeEntity) => <figure key={item.uuid} className='node'>
              <Link href={item.path} className="image-holder"><a className="image-link" style={item.firstImage.calcAspectStyle()}>
              {item.hasImage ? <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' /> : <div className='frame'></div>}
              <figcaption>
                <time>{ shortDate(item.field_date) }</time>
                <h3>{item.title}</h3>
                </figcaption>
              </a></Link>
            </figure>)}
          </div>
          {showPaginator && <LoadMoreNav data={ pageData } />}
        </>}
      </section>
    </Container>
    </>
}

export default NewsList;