import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { MetaDataSet } from "../lib/ui-entity";
import { BaseEntity, SiteInfo } from "../lib/api-view-results";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";

const ExhibitionList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const hasItems = pageData.items.length > 0;
  const { items } = pageData;
  return <section className="exhibition-list">
    {hasItems && <>
      <ul>
          {items.map(item => <li key={item.uuid}>
            <Link href={item.path}><a>
              {item.hasImage && <Image loader={defaultImageLoader} src={item.firstImage.preview} alt={item.alt} width={item.firstImage.calcWidth('preview')} height={item.firstImage.calcHeight('preview')} />}
              <span className="text">{item.title}</span>
            </a></Link>
          </li>)}
      </ul>
      <Paginator pageData={pageData} maxLinks={10} />
    </>}
  </section>
}

export default ExhibitionList;