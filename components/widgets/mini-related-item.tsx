import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";

const MiniRelatedItem = ({ item }: { item: NodeEntity }) => {
  return <div className='related-mini' >
    <Link href={item.path}>
      <a className='text-details'>
        <h4><span className='text'>{item.title}</span></h4>
        <p className='short-date'>{item.shortDate}</p>
        <p>{item.summary}</p>
      </a>
    </Link>
  </div>
}

export default MiniRelatedItem;