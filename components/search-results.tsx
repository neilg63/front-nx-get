import { NextPage } from "next";
import { useCallback, useEffect, useState } from 'react'
import { BaseEntity, KeyStringValue, SearchItem } from "../lib/interfaces";
import { NodeEntity, SearchPageDataSet } from "../lib/entity-data";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container, Input } from "@nextui-org/react";
import { addEndClasses, containerProps } from "../lib/styles";
import FigureResultPreview from "./widgets/figure-result-preview";
import TextResultPreview from "./widgets/text-result-preview";
import LoadMoreNav from "./widgets/load-more-nav";
import labels from "../lib/labels";
import { NextRouter, useRouter } from "next/router";
import { notEmptyString } from "../lib/utils";
import SearchSuggestions from "./widgets/search-suggestions";
import { toLocal } from "../lib/localstore";
import { resetLastItem } from "../lib/row-justify";

const showItemAsFigure = (bundle: string) => {
  return ['artwork'].includes(bundle);
}

const sectionListClassNames = (section: KeyStringValue) => {
  const cls = ['results'];
  switch (section.key) {
    case 'artwork':
      cls.push('fixed-height-rows');
      cls.push('tall-height');
      cls.push('extra-spacing');
      break;
  }
  return cls.join(' ');
}

const extractTermsFromRouter = (router: NextRouter): string => {
  const path = router.asPath;
  const termSlug = typeof path === 'string' && path.includes('/') ? path.split('/').pop()! : '';
  return termSlug.replace(/-/, ' ');
}

const sectionClassNames = (section: KeyStringValue) => {
  const cls = ['result-section', ['content-type', section.key.replace(/_/g, '-')].join('--')];
  return cls.join(' ');
}

const SearchResults: NextPage<BaseEntity> = (data) => {  
  const [hasItems, setHasItems] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const router = useRouter();
  
  const pageData = new SearchPageDataSet(data);
  
  const { containers, meta, total, perPage } = pageData;
  const [showPaginator, setShowPaginator] = useState(false);

  const downloadLabel = pageData.site.label('download_pdf');

  const noSearchResultsText = pageData.label('search_no_results');
  
  const submitSearch = () => {
    if (notEmptyString(searchString, 1)) {
      const path = ['/search', encodeURIComponent(searchString.toLowerCase())].join('/');
      router.push(path);
    }
  }

  const setSearchStringFromPath = useCallback(() => {
    const searchTerms = extractTermsFromRouter(router);
    setSearchString(searchTerms);
  }, [router]);

  const submitOnEnter = (e: any) => {
    if (e instanceof Object) {
      if (e.keyCode) {
        if (e.keyCode === 13) {
          submitSearch();
        }
      }
    }
  }

 const updateSearch = (e: any) => {
    if (e instanceof Object) {
      const { target } = e;
      if (target instanceof Object) {
        setSearchString(target.value);
      }
    }
 }
  
  const onSelect = (row: SearchItem) => {
    if (row instanceof Object) {
      router.push(row.path);
    }
  }

  const buildId = (sectionKey = '') => {
    return [sectionKey,'results', 'container'].join('-');
  }

  useEffect(() => {
    toLocal('current_search_string', searchString);
    setHasItems(containers.size > 0);
    setShowPaginator(total > 0 && total > perPage);
    if (searchString.length < 1 && !initialised) {
      setSearchStringFromPath();
      setInitialised(true);
    }
    setTimeout(() => {
      addEndClasses(document)
      resetLastItem('artwork-results-container')
    }, 200);
    addEndClasses(document)
  }, [containers, perPage, total, hasItems, setHasItems, showPaginator, router, setSearchStringFromPath, searchString, initialised]);
  const searchStringDisplay = decodeURIComponent(searchString).replace(/%20/g, ' ');
  return <>
    <SeoHead meta={meta} />
    <Container {...containerProps} className='search-results'>
      <fieldset className='row search-bar'>
        <Input placeholder={labels.search} value={searchStringDisplay} name='search_long' onChange={updateSearch} onKeyDown={e => (submitOnEnter(e))} className='long-text' id='search-results-long-search-field' aria-labelledby={labels.search} fullWidth={true} width='100%' shadow={false} rounded={false} onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)} />
        <i className='icon icon-search'></i>
        <SearchSuggestions search={searchString} onSelect={(row: SearchItem) => onSelect(row) }  focus={searchFocus }/>
      </fieldset>
      {hasItems ? <>
        <section className="search-sections">
          {pageData.bundleSet.map((section: KeyStringValue, index) => <div className={sectionClassNames(section)} key={['section', section.key, index].join('-')} id={buildId(section.key)}>
          <h2>{section.value}</h2>
          <div className={sectionListClassNames(section)}>
            {pageData.results(section.key).map((item: NodeEntity, subIndex) => 
              showItemAsFigure(item.bundle) ? <FigureResultPreview item={item} index={subIndex} key={item.key} /> : <TextResultPreview item={item} index={subIndex} key={item.key} downloadLabel={ downloadLabel } />
            )}
            {showItemAsFigure(section.key) && <figure className="last-item"></figure>}
          </div>
            </div>)}
        </section>
        {showPaginator && <LoadMoreNav data={pageData} />}
      </> : <>
        <section className="search-sections no-results">
          <h3>{noSearchResultsText}</h3>
        </section>
      </>}
    </Container>
  </>
}

export default SearchResults;