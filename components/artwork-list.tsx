import { NextPage } from "next";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { BaseEntity } from "../lib/interfaces";
import { PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import TagList from "./widgets/tag-list";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";
import TypeLink from "./widgets/type-link";
import YearLink from "./widgets/year-link";
import Head from "next/head";
import { Container } from "@nextui-org/react";
import SeoHead from "./layout/head";
import { containerProps } from "../lib/styles";

const ArtworkList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, total, perPage, meta } = pageData;
  const showPaginator = total > 0 && total > perPage;
  const hasItems = items instanceof Array && items.length > 0;
  const basePath = '/artworks/';
  const emptyFigStyles = { width: 0, display: 'none' };
  useEffect(() => {
    const container = document.querySelector('.artwork-list .flex-rows-6');
    if (container) {
      const figs = container.querySelectorAll('figure.node');
      const lastIndex = figs.length - 1;
      const contRect = container.getBoundingClientRect();
      const lastFigRect = figs[lastIndex].getBoundingClientRect();
      const lastRowFigs = [...figs].filter(f => f.getBoundingClientRect().y === lastFigRect.y);
      const lastRowWidth = lastRowFigs.map(f => f.getBoundingClientRect().width).reduce((a, b) => a + b, 0);
      const remaining = contRect.width - lastRowWidth;
      const empFig = container.querySelector('.empty-figure')
      if (empFig instanceof HTMLElement && remaining > 10) {
        empFig.style.display = 'block';
        empFig.style.width = `${remaining}px`;
      }
    }
  });
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="artwork-list">
        {hasItems && <><div className="flex-rows-6">
          {items.map(item => <figure key={item.uuid} data-key={item.uuid} data-dims={item.firstImage.dims('medium')} style={item.firstImage.calcAspectStyle()} className='node'>
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