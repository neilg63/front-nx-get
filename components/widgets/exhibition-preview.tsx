import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";
import DateRange from "./date-range";
import MediaFigure from "./media-figure";

const ExhibitionPreview = ({node}: {node: NodeEntity}) => {
  return <article>
    <Link href={node.path}><a>
        <h3>{node.title}</h3>
        <MediaFigure item={node.firstImage} size='preview' width='auto' height='100%' />
        <p><DateRange item={node.field_date_range} /></p>
        <p>{node.summary}</p>
      </a>
    </Link>
  </article>
}

export default ExhibitionPreview;