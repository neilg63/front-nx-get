import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { MetaDataSet } from "../lib/ui-entity";
import { BaseEntity, SiteInfo } from "../lib/api-view-results";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import DateRange from "./widgets/date-range";

const ExhibitionList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const hasItems = pageData.items.length > 0;
  const { items, meta, total, perPage } = pageData;
  const showPaginator = total > perPage;
  return  <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="exhibition-list">
        {hasItems && <><div className="columns">
          {items.map(item => <figure key={item.uuid} data-key={item.uuid} data-dims={item.firstImage.dims('medium')}>
              <Link href={item.path} className="image-holder"><a className="image-link">
                {item.hasImage && <Image loader={defaultImageLoader} src={item.firstImage.preview} alt={item.alt} width={item.firstImage.calcWidth('preview')} height={item.firstImage.calcHeight('preview')} objectFit='contain' layout='intrinsic' />}
                </a></Link>
              <figcaption>
                <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
               
                <DateRange item={item.field_date_range}  />
              </figcaption>
              </figure>)} 
          </div>
          {showPaginator && <Paginator pageData={pageData} maxLinks={8} />}
        </>}
      </section>
    </Container>
  </>
}

export default ExhibitionList;