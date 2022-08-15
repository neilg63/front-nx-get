import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { BaseEntity, SiteInfo } from "../lib/api-view-results";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";
import TagList from "./widgets/tag-list";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";

const ArtworkList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items } = pageData;
  const hasItems = items instanceof Array && items.length > 0;
  return <section className="artwork-list">
    {hasItems && <><section className="column">
      {items.map(item => <article key={item.uuid} data-key={item.uuid}>
          <h3>
          <Link href={item.path}><a>
            {item.hasImage && <Image loader={defaultImageLoader} src={item.preview} alt={item.alt} width={item.calcWidth('preview')} height={item.calcHeight('preview')} />}
              <span className="text">{item.title}</span>
            </a></Link>
        </h3>
        <TagList terms={item.field_tags} base='/artworks' />
          </article>)} 
      </section>
      <Paginator pageData={pageData} maxLinks={8} />
    </>}
  </section>
}

export default ArtworkList;