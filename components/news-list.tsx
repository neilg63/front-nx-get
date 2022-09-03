import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import { mediumDate } from "../lib/converters";
import { Container, Image } from "@nextui-org/react";
import { containerProps, resizeAllGridItems } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";
import contentTypes from "../lib/content-types";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import labels from "../lib/labels";

const NewsList: NextPage<BaseEntity> = (data) => {  
  const pageData = useMemo(() => new PageDataSet(data), [data]);
  const { items, meta, total, perPage} = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  const router = useRouter();
  const loadNextPrev = useCallback((forward = true) => {
    const currPath = router.asPath.split('?').shift();
    const nextPage = forward ? pageData.page + 1 : pageData.page - 1;
    const nextPageNum = nextPage + 1;
      router.push(currPath + '?page=' + nextPageNum);
      pageData.page = nextPage;
  }, [pageData, router]);

  useEffect(() => {
    setTimeout(() => {
      resizeAllGridItems(document, window);
    }, 500);
  });
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
        <header className="section-header">
          <h1>{contentTypes.news}</h1>
      </header>
      <section className="news-list grid-list">
        {hasItems && <><div className="columns">
          {items.map((item: NodeEntity) => <figure key={item.uuid} className='node'>
            <time>{ mediumDate(item.field_date) }</time>
              <Link href={item.path} className="image-holder"><a className="image-link">
              {item.hasImage && <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' />}
              </a></Link>
            <figcaption>
              <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
            {item.hasTextField('placename') && <p className="place-name">{ item.field_placename }</p>}
            </figcaption>
            </figure>)}
          </div>
          {showPaginator && <nav className='listing-nav row'>
            {pageData.mayLoadPrevious && <span className='nav-link prev' title={pageData.prevPageOffset(1).toString()} onClick={() => loadNextPrev(false)}><i className='icon icon-prev-arrow-narrow prev'></i>{ labels.load_newer}</span>}
            <span className='text-label' onClick={() => loadNextPrev(pageData.mayLoadMore)}>{pageData.listingInfo} </span>
            {pageData.mayLoadMore && <span className='nav-link next' title={pageData.nextPageOffset.toString()} onClick={() => loadNextPrev(true)}>{ labels.load_older}<i className='icon icon-next-arrow-narrow next'></i></span>}
          </nav>}
        </>}
      </section>
    </Container>
    </>
}

export default NewsList;