import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
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

const PressList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items, meta, total, perPage } = pageData;
  const hasItems = items.length > 0;
  const showPaginator = total > 0 && total > perPage;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps}>
      <section className="press-list">
      {hasItems && <>
        <ul>
        {items.map((item: NodeEntity) => <li key={item.uuid}>
          <time>{ mediumDate(item.field_date) }</time>
            <h3><Link href={item.path}><a>
              {item.hasImage && <Image loader={defaultImageLoader} src={item.firstImage.preview} alt={item.alt} width={item.firstImage.calcWidth('preview')} height={item.firstImage.calcHeight('preview')} />}
              <span className="text">{item.title}</span>
          </a></Link></h3>
          <p>{item.field_source}</p>
          {item.hasDocument && <DownloadLink item={item.field_document!} label={ labels.downloadPdf} />}
          </li>)} 
        </ul>
        {showPaginator && <Paginator pageData={pageData} maxLinks={8} />}
      </>}
    </section>
    </Container>
  </>
}

export default PressList;