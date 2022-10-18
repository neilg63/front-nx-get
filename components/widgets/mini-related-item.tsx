import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";

const MiniRelatedItem = ({ item, mode, showDate, dateMode, showLocation }: { item: NodeEntity, mode: string, showDate: boolean, dateMode: string, showLocation: boolean  }) => {
  const showSummary = ['summary', 'full'].includes(mode);
  const dateStr = dateMode === 'short' ? item.shortDate : item.year;
  const className = showSummary ? 'related-mini with-summary' : 'related-mini no-summary';
  return <div className={className}>
    <Link href={item.path}>
      <a className='text-details'>
        <em className='text'>{item.title}</em>
        {showLocation && <span className='location'>{item.field_placename}</span>}
        {showDate && <span className='short-date'>{dateStr}</span>}
        {item.hasAuthor && <span className='author'>{item.field_author}</span>}
        {showSummary && <p>{item.summary}</p>}
      </a>
    </Link>
  </div>
}

MiniRelatedItem.defaultProps = {
  mode: 'summary',
  dateMode: 'short',
  showDate: true,
  showLocation: false
};

export default MiniRelatedItem;