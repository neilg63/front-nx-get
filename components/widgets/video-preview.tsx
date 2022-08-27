import Link from "next/link";
import { shortDate } from "../../lib/converters";
import { NodeEntity } from "../../lib/entity-data";
import MediaFigure from "./media-figure";


const VideoPreview = ({node}: {node: NodeEntity}) => {

  return <figure className='node-preview'>
    <Link href={node.path}>
      <a>
        <MediaFigure item={ node.firstImage } size='preview' width='auto' height='100%' objectFit='cover' />
        <h4>{node.title}</h4>
        <p>{shortDate(node.field_date)}</p>
      </a>
    </Link>
  </figure>

}

export default VideoPreview;