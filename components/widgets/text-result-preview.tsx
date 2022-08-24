import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";

const TextResultPreview = ({ item, index }: { item: NodeEntity, index: number }) => {
  const title = (index + 1).toString();
  return (
    <article title={title}>
      <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
    </article>
  )
}

export default TextResultPreview;