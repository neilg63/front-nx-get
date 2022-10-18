import Link from "next/link";
import { shortDate } from "../../lib/converters";
import { NodeEntity } from "../../lib/entity-data";
import MediaFigure from "./media-figure";


const VideoPreview = ({node}: {node: NodeEntity}) => {

  return <div className='node-preview'>
    <Link href={node.path}>
      <a>
        <MediaFigure item={ node.firstImage } size='preview' width='auto' height='100%' objectFit='cover' />
        <h4>{node.title}</h4>
        <p>{shortDate(node.field_date)}</p>
      </a>
    </Link>
  </div>

}

export default VideoPreview;