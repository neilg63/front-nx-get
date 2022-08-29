import Link from "next/link";
import { shortDate } from "../../lib/converters";
import { NodeEntity } from "../../lib/entity-data";
import DateRange from "./date-range";
import MediaFigure from "./media-figure";

const TimelineItem = ({ node }: { node: NodeEntity }) => {
  
  const selectPath = (node: NodeEntity) => {
    const datePart = node.path.split('/').pop();
    return ['/about/timeline', datePart].join('/');
  }

  return <div className="timeline-item">
    <Link href={selectPath(node)}><a>
        <h4>{ shortDate(node.field_date) }</h4>
        <h3>{node.title}</h3>
      </a>
    </Link>
  </div>
}

export default TimelineItem;