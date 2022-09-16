import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";
import MediaFigure from "./media-figure";


const RelatedItem = ({ item, className }: { item: NodeEntity, className: string }) => {
  return <div className='related-item' >
    <Link href={item.path}>
      <a className={ className }>
        {item.hasImage && <MediaFigure item={item.firstImage} size='preview' width='100%' height='auto' objectFit='contain' />}
          <div className='text-details'>
          <h4><span className='text'>{item.title}</span> <em>{item.field_year}</em></h4>
          <p>{item.summary}</p>
        </div>
      </a>
    </Link>
  </div>
}

RelatedItem.defaultProps = {
  className: 'grid-2'
};

export default RelatedItem;