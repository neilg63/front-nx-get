import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { toImageSrc, toImageSrcSet } from "../lib/ui-entity";
import { notEmptyString, defaultImageLoader } from "../lib/utils";
import { NodeEntity } from "../lib/entity-data";

const ArtworkPage: NextPage<{entity: NodeEntity}> = ({entity} ) => {  
  const keys = Object.keys(entity);
  const images = entity.field_images instanceof Array ? entity.field_images : [];
  const hasImages = images.length > 0;
  const hasBody = keys.includes('body') && notEmptyString(entity.body);
  const hasSubtitle = keys.includes('subtitle');
  const nextAlias = '/artworks';
  return <article className="artwork">
    {hasBody && <>
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
      {hasBody && <div className="body">{parse(entity.body)}</div>}
      {hasImages && images.map((row:any) => <figure key={row.id}>
        <img srcSet={toImageSrcSet(row)} src={toImageSrc(row)} alt={row.alt} />
        <figcaption>{row.field_credit}</figcaption>
      </figure>)}
      
    </>}
  </article>
}

export default ArtworkPage;