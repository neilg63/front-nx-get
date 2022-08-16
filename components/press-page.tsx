import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { MediaItem, NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/api-view-results";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";

const PressPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity } = pageData;
  const nextAlias = '/press';
  return <article className="press">
    <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
    {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
    {entity.hasImages && <section className="media-items">
      {entity.images.map((item: MediaItem) => <figure key={item.uri} data-key={item.uri} data-dims={item.dims('medium')}>
        <Image loader={defaultImageLoader}  sizes={item.srcSet} src={item.medium} alt={item.alt} width={item.calcWidth('medium')} height={item.calcHeight('medium')} />
        <figcaption>{item.field_credit}</figcaption>
      </figure>)}
    </section>}
  </article>
}

export default PressPage;