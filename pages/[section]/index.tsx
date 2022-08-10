import type { NextPage } from 'next'
import parse from "html-react-parser"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { MediaItem, PageDataSet } from '../../lib/entity-data';

const ListingPage: NextPage<PageDataSet> = ({entity, items, meta} ) => {  
  const { path } = meta;
  const nextAlias = path == '/exhibitions' ? '/news' : '/exhibitions';
  return  <article>
    {entity.hasBody && <>
      <h1><Link href={nextAlias}><a>{entity.title}</a></Link></h1>
      {entity.hasSubtitle && <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>}
      <div className="body">{parse(entity.body)}</div>
      {entity.hasImages && entity.images.map((item:MediaItem) => <figure key={item.uuid}>
        <img srcSet={item.toImageSrc()} src={item.size('max_1300x1300')} alt={item.alt} />
        <figcaption>{item.field_credit}</figcaption>
      </figure>)}
      {items && <ul>
        {items.map(item => <li key={item.uuid}>{item.title}</li>)} 
      </ul>}
    </>}
  </article>
}

export default ListingPage;
