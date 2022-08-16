import { NextPage } from "next";
import Link from 'next/link';
import parse from "html-react-parser";
import { MediaItem, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/api-view-results";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";

const ExhibitionPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity } = pageData;
  const nextAlias = '/exhibitions';
  return <article className="exhibition">
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {entity.hasSubtitle && <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>}
       {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      {entity.hasImages && <section className="media-items">
      {entity.images.map((item: MediaItem) => <figure key={item.uri} data-key={item.uri} data-dims={item.dims('medium')}>
        <Image loader={defaultImageLoader}  sizes={item.srcSet} src={item.medium} alt={item.alt} width={item.calcWidth('medium')} height={item.calcHeight('medium')} />
        <figcaption>{item.field_credit}</figcaption>
      </figure>)}
    </section>}
  </article>
}

export default ExhibitionPage;