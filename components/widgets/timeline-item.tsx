import Link from "next/link";
import { shortDate } from "../../lib/converters";
import { NodeEntity } from "../../lib/entity-data";

const TimelineItem = ({ node, selected }: { node: NodeEntity, selected: number }) => {
  
  const selectPath = (node: NodeEntity) => {
    const datePart = node.path.split('/').pop();
    return ['/about/timeline', datePart].join('/');
  }

  const cls = ['timeline-item']; 
  if (node.nid === selected) {
    cls.push('selected');
  }
  const wrapperClasses = cls.join(' ');
  return <div className={wrapperClasses}>
    <Link href={selectPath(node)}><a>
        <h4>{ shortDate(node.field_date) }</h4>
        <h3>{node.title}</h3>
      </a>
    </Link>
  </div>
}

export default TimelineItem;