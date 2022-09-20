import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";
import labels from "../../lib/labels";
import DateRange from "./date-range";
import MediaFigure from "./media-figure";

const ExhibitionPreview = ({ node }: { node: NodeEntity }) => {
  
  return <article>
    <Link href={node.path}><a>
      <MediaFigure item={node.firstImage} size='medium' width='100%' height='auto' objectFit='contain' />
        <h3 className='upper'>{ labels.current_exhibition }</h3>
        <h3><span className='upper'>{node.title}</span> {node.hasPlacename && <span className="placename">{node.field_placename}</span>}</h3>
        <p><DateRange item={node.field_date_range} format='short' /></p>
      </a>
    </Link>
  </article>
}

export default ExhibitionPreview;