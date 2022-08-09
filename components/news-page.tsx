import { NextPage } from "next";
import { JsonApiResource } from "next-drupal";
import parse from "html-react-parser";
import Link from 'next/link';
import { toImageSrc, toImageSrcSet } from "../lib/ui-entity";
import { notEmptyString, defaultImageLoader } from "../lib/utils";

const NewsPage: NextPage<{entity: JsonApiResource}> = ({entity} ) => {  
  const keys = Object.keys(entity);
  console.log( entity.field_media)
  const hasImage = entity.field_media instanceof Object;
  const image = hasImage ? entity.field_media : {};
  
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