import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import { mediumDate } from "../lib/converters";
import { Container, Image } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import Head from "next/head";
import SeoHead from "./layout/head";

const NewsList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta, total, perPage} = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="news-list grid-list">
        {hasItems && <><div className="columns">
          {items.map((item: NodeEntity) => <figure key={item.uuid}>
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
          {showPaginator && <Paginator pageData={pageData} maxLinks={8} />}
        </>}
      </section>
    </Container>
    </>
}

export default NewsList;