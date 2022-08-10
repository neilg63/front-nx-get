import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { defaultImageLoader } from "../lib/utils";
import { MediaItem, NodeEntity, PageDataSet } from "../lib/entity-data";

const ArtworkPage: NextPage<PageDataSet> = ({entity, site, meta} ) => {  
  const keys = Object.keys(entity);
  const nextAlias = '/artworks';
  return <article className="artwork">
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
      {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
      {entity.hasImages && entity.images.map((item:MediaItem) => <figure key={item.uuid}>
        <img srcSet={item.toImageSrc()} src={item.size('ax_1300x1300')} alt={item.alt} />
        <figcaption>{item.field_credit}</figcaption>
      </figure>)}
  </article>
}

export default ArtworkPage;