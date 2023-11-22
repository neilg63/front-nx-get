import { NextPage } from "next";
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { addEndClasses, containerProps } from "../lib/styles";
import AboutNav from "./widgets/about-nav";
import PublicationItem from "./widgets/publication-item";
import { justifyRows, resetJustifiedRows } from "../lib/row-justify";
import { useContext, useEffect, useState } from "react";
import { TopContext } from "../pages/_app";

const PublicationList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const [currWW, setCurrWW] = useState(0);
  const context = useContext(TopContext);
  const { items, meta } = pageData;
  const hasItems = items.length > 0;
  useEffect(() => {
    if (currWW < 20 && context?.width) {
      setCurrWW(context?.width as number);
    }
    setTimeout(() => {
      addEndClasses(document)
    }, 200);
    
    const normaliseGrid = () => {
      justifyRows('publication-list-container', true)
    }
    setTimeout(normaliseGrid, 80);
    addEndClasses(document);
    const onResize = () => {
      
      const cw = context?.width as number;
      const diff = cw > 20 ? Math.abs(cw - currWW) : 0;
      if (diff > 50) {
        setCurrWW(cw);
        resetJustifiedRows("publication-list-container", normaliseGrid);
      }
      const adjustGridRows = () => {
        setTimeout(normaliseGrid, 100);
      }
    }
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [context, currWW]);
  return <>
    <Head>
      <title>{meta.title}</title>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='about-listing-container listing-main'>
      <AboutNav current='/about/publications' />
      <section className="publication-list grid-list" id="publication-list-container">
        <>
        {hasItems && 
          <div className='fixed-height-rows tall-height'>
              {items.map((item: NodeEntity, index: number) => <PublicationItem key={['publication-item', item.uuid].join('-')} item={item} index={index } />)}
          </div>} 
          
        </>
      </section>
    </Container>
  </>
}

export default PublicationList;