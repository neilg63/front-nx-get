import Link from "next/link";
import { shortDate } from "../../lib/converters";
import { NodeEntity } from "../../lib/entity-data";


const NewsItemPreview = ({node}: {node: NodeEntity}) => {

  return <article className='node-preview'>
    <Link href={node.path}>
      <a>
        <p>{shortDate(node.field_date)}</p>
        <h4>{ node.title }</h4>
      </a>
    </Link>
  </article>

}

export default NewsItemPreview;