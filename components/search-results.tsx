import { NextPage } from "next";
import { useEffect, useState } from 'react'
import { BaseEntity, KeyStringValue, YearNum } from "../lib/interfaces";
import { NodeEntity, SearchPageDataSet } from "../lib/entity-data";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import FigureResultPreview from "./widgets/figure-result-preview";
import TextResultPreview from "./widgets/text-result-preview";
import { setEmtyFigureHeight } from "../lib/dom";
import LoadMoreNav from "./widgets/load-more-nav";

const showItemAsFigure = (bundle: string) => {
  return ['artwork'].includes(bundle);
}

const sectionListClassNames = (section: KeyStringValue) => {
  const cls = ['results'];
  switch (section.key) {
    case 'artwork':
      cls.push('flex-rows-6');
      break;
  }
  return cls.join(' ');
}

const sectionClassNames = (section: KeyStringValue) => {
  const cls = ['result-section', ['content-type', section.key.replace(/_/g, '-')].join('--')];
  return cls.join(' ');
}

const SearchResults: NextPage<BaseEntity> = (data) => {  
  const [hasItems, setHasItems] = useState(false);
  const pageData = new SearchPageDataSet(data);
  const { containers, meta, total, perPage } = pageData;
  const [showPaginator, setShowPaginator] = useState(false);
  const emptyFigStyles = { width: 0, display: 'none' };
  useEffect(() => {
    setHasItems(containers.size > 0);
    setShowPaginator(total > 0 && total > perPage);
    setEmtyFigureHeight(document);
  }, [containers, perPage, total, hasItems, setHasItems,showPaginator, setShowPaginator])
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='search-results'>
      {hasItems && <>
        <section className="search-sections">
        {pageData.bundleSet.map((section: KeyStringValue, index) => <div className={sectionClassNames(section)} key={['section', section.key, index].join('-')}>
          <h2>{section.value}</h2>
          <div className={sectionListClassNames(section)}>
            {pageData.results(section.key).map((item: NodeEntity, subIndex) => 
                showItemAsFigure(item.bundle) ? <FigureResultPreview item={item} index={subIndex} key={item.key} /> : <TextResultPreview item={item} index={subIndex} key={item.key} />
            )}
            { showItemAsFigure(section.key) && <figure className="empty-figure" style={ emptyFigStyles }></figure>}
          </div>
            </div>)} 
        </section>
        {showPaginator && <LoadMoreNav data={pageData} />}
      </>}
    </Container>
  </>
}

export default SearchResults;