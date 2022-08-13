import { NextPage } from "next";
import Link from 'next/link';
import parse from "html-react-parser";
import { MediaItem, NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/api-view-results";

const ExhibitionPage: NextPage<BaseEntity> = (data ) => {  
  const pageData = new PageDataSet(data);
  const { entity } = pageData;
  const nextAlias = '/exhibitions';
  return <article className="exhibition">
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {entity.hasSubtitle && <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>}
       {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      {entity.hasImages && entity.images.map((item: MediaItem) => <figure key={item.uuid}>
        <img srcSet={item.srcSet} src={item.medium} alt={item.alt} />
        <figcaption>{item.field_credit}</figcaption>
      </figure>)}
  </article>
}

export default ExhibitionPage;