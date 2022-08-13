import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { defaultImageLoader } from "../lib/utils";
import { MediaItem, NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/api-view-results";

const ArtworkPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity } = pageData;
  const nextAlias = '/artworks';
  return <article className="artwork">
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
      {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
    {entity.hasImages && <section className="media-items">
      {entity.images.map((item:MediaItem) => <figure key={item.uuid}>
        <img srcSet={item.srcSet} src={item.medium} alt={item.alt} />
        <figcaption>{item.field_credit}</figcaption>
      </figure>)}
    </section>}
  </article>
}

export default ArtworkPage;