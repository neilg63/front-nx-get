import { NextPage } from "next";
import Link from 'next/link';
import parse from "html-react-parser";
import { NodeEntity } from "../lib/entity-data";
import { toImageSrc, toImageSrcSet } from "../lib/ui-entity";

const ExhibitionPage: NextPage<{entity: NodeEntity}> = ({entity} ) => {  
  const keys = Object.keys(entity);
  const images = entity.field_images instanceof Array ? entity.field_images : [];
  const hasImages = images.length > 0;
  const hasBody = keys.includes('body');
  const hasSubtitle = keys.includes('subtitle');
  const nextAlias = '/exhibitions';
  return <article className="exhibition">
    {hasBody && <>
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {hasSubtitle && <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>}
      <div className="body">{parse(entity.body)}</div>
      {hasImages && images.map((row:any) => <figure key={row.id}>
        <img srcSet={toImageSrcSet(row)} src={toImageSrc(row)} alt={row.alt} />
        <figcaption>{row.field_credit}</figcaption>
      </figure>)}
      
    </>}
  </article>
}

export default ExhibitionPage;