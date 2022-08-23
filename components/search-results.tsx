import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity, KeyStringValue } from "../lib/interfaces";
import { NodeEntity, PageDataSet, SearchPageDataSet } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";
import Paginator from "./widgets/paginator";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";
import DownloadLink from "./widgets/download-link";
import labels from "../lib/labels";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";

const SearchResults: NextPage<BaseEntity> = (data) => {  
  const pageData = new SearchPageDataSet(data);
  const { containers, meta, total, perPage } = pageData;
  const hasItems = containers.size > 0;
  const showPaginator = total > 0 && total > perPage;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="search-results">
      {hasItems && <>
        <section className="search-sections">
        {pageData.bundleSet.map((section: KeyStringValue) => <li key={['section', section.key].join('-')}>
          <h2>{section.value}</h2>
          <div className="results">
            {pageData.results(section.key).map((item: NodeEntity) => (
              <h3 key={item.uuid}><Link href={item.path}><a>
                {item.hasImage && <Image loader={defaultImageLoader} src={item.firstImage.preview} alt={item.alt} width={item.firstImage.calcWidth('preview')} height={item.firstImage.calcHeight('preview')} />}
                <span className="text">{item.title}</span>
              </a></Link></h3>
              )
            )}
          </div>
            </li>)} 
        </section>
        {showPaginator && <Paginator pageData={pageData} maxLinks={8} />}
      </>}
    </section>
    </Container>
  </>
}

export default SearchResults;