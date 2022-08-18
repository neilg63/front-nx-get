import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { BaseEntity } from "../lib/api-view-results";
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
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="artwork-list">
        {hasItems && <><div className="flex-rows-6">
          {items.map(item => <figure key={item.uuid} data-key={item.uuid} data-dims={item.firstImage.dims('medium')} style={item.firstImage.calcAspectStyle()}>
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
          </div>
          {showPaginator && <Paginator pageData={pageData} maxLinks={8} />}
        </>}
      </section>
    </Container>
  </>
}

export default ArtworkList;