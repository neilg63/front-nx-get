import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import MediaFigure from "./widgets/media-figure";
import RelatedItem from "./widgets/related-item";
import { relatedKey } from "../lib/ui-entity";
import contentTypes from "../lib/content-types";

const EssayPage: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity } = pageData;
  const nextAlias = '/about/essays';
  return <article className="press">
    <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
    {entity.hasImage && <MediaFigure item={ entity.field_media } size='large' width='100%' height='auto' objectFit='contain' />}
    {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
    <div className='related-artworks related'>
      <h3>{ contentTypes.artwork }</h3>
      <div className='flex-grid-2'>
        {entity.hasRelatedArtworks && entity.related_artworks.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={row} />)}
      </div>
    </div>
  </article>
}

export default EssayPage;