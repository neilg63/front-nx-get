import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity, YearNum } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";
import { Container, Image } from "@nextui-org/react";
import { containerProps, resizeAllGridItems } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";
import { useEffect, useMemo } from "react";
import LoadMoreNav from "./widgets/load-more-nav";
import BreadcrumbTitle from "./widgets/breadcrumb-title";
import YearNav from "./widgets/year-nav";

const NewsList: NextPage<BaseEntity> = (data) => {  
  const pageData = useMemo(() => new PageDataSet(data), [data]);
  const { items, meta, total, perPage, sets } = pageData;
  const years = sets.has('years') ? sets.get('years') as YearNum[]: [];
  const hasYears = years instanceof Array && years.length > 0;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  const subPath = meta.endPath;
  useEffect(() => {
     window.addEventListener("resize", () => {
      resizeAllGridItems(document, window);
    });
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
      </header>
      <nav className='filter-nav show-by-year'>
        <h1><BreadcrumbTitle path={pageData.meta.path} title={ pageData.contextTitle } /></h1>

        {hasYears && <YearNav years={years} current={ subPath } basePath='/news' />}
      </nav>
      <section className="news-list grid-list">
        {hasItems && <><div className="columns">
          {items.map((item: NodeEntity) => <figure key={item.uuid} className='node'>
            <time>{ mediumDate(item.field_date) }</time>
              <Link href={item.path} className="image-holder"><a className="image-link">
              {item.hasImage && <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} />}
              </a></Link>
            <figcaption>
              <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
            {item.hasTextField('placename') && <p className="place-name">{ item.field_placename }</p>}
            </figcaption>
            </figure>)}
          </div>
          {showPaginator && <LoadMoreNav data={ pageData } />}
        </>}
      </section>
    </Container>
    </>
}

export default NewsList;