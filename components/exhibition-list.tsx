import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/api-view-results";
import { PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import { defaultImageLoader } from "../lib/utils";
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container, Image } from "@nextui-org/react";
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
      <section className="exhibition-list grid-list">
        {hasItems && <><div className="columns">
          {items.map(item => <figure key={item.uuid} data-key={item.uuid} data-dims={item.firstImage.dims('medium')}>
              <Link href={item.path} className="image-holder"><a className="image-link">
                {item.hasImage && <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' />}
                </a></Link>
              <figcaption>
                <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
              {item.hasTextField('placename') && <p className="place-name">{ item.field_placename }</p>}
                <p className="date-range"><DateRange item={item.field_date_range}  /></p>
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