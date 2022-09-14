import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";

const MiniRelatedItem = ({ item, mode }: { item: NodeEntity, mode: string }) => {
  const showSummary = ['summary', 'full'].includes(mode);
  return <div className='related-mini' >
    <Link href={item.path}>
      <a className='text-details'>
        <h4><span className='text'>{item.title}</span></h4>
        <p><span className='short-date'>{item.shortDate}</span> {item.hasAuthor && <span className='author'>{item.field_author}</span>}</p>
        {showSummary && <p>{item.summary}</p>}
      </a>
    </Link>
  </div>
}

MiniRelatedItem.defaultProps = {
  mode: 'summary'
};

export default MiniRelatedItem;