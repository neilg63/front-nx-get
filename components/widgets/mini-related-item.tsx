import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";

const MiniRelatedItem = ({ item, mode, showDate, dateMode }: { item: NodeEntity, mode: string, showDate: boolean, dateMode: string }) => {
  const showSummary = ['summary', 'full'].includes(mode);
  const dateStr = dateMode === 'short' ? item.shortDate : item.year;
  return <div className='related-mini' >
    <Link href={item.path}>
      <a className='text-details'>
        <h4><span className='text'>{item.title}</span></h4>
        <p>{showDate && <span className='short-date'>{dateStr}</span>}{item.hasAuthor && <span className='author'>{item.field_author}</span>}</p>
        {showSummary && <p>{item.summary}</p>}
      </a>
    </Link>
  </div>
}

MiniRelatedItem.defaultProps = {
  mode: 'summary',
  dateMode: 'short',
  showDate: true
};

export default MiniRelatedItem;