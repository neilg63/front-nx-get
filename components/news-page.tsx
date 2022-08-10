import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { toImageSrc, toImageSrcSet } from "../lib/ui-entity";
import { notEmptyString } from "../lib/utils";
import { NodeEntity } from "../lib/entity-data";

const NewsPage: NextPage<{entity: NodeEntity}> = ({entity}: {entity: NodeEntity} ) => {  
  const keys = Object.keys(entity);
  console.log( entity.field_images)
  const hasImage = entity.field_images instanceof Array && entity.field_images.length > 0;
  const image = entity.firstImage;
  
  const hasBody = keys.includes('body') && notEmptyString(entity.body);
  const hasSubtitle = keys.includes('subtitle');
  const nextAlias = '/news';
  return <article className="news">
    {hasBody && <>
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
      {hasBody && <div className="body">{parse(entity.body)}</div>}
      {hasImage && <figure key={image.id}>
        <img srcSet={toImageSrcSet(image)} src={toImageSrc(image)} alt={image.alt} />
        <figcaption>{image.field_credit}</figcaption>
      </figure>}
    </>}
  </article>
}

export default NewsPage;