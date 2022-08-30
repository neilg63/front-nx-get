import Image from "next/image"
import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data"
import { defaultImageLoader } from "../../lib/utils"

const itemId = (id = '') => ['ap', id].join('-');

const ArtwworkFigure = ({ item, index }: { item: NodeEntity, index: number }) => {
  return <figure key={item.indexedKey(index)} id={ itemId(item.uuid) }  style={item.firstImage.calcAspectStyle()} className='node'>
  <Link href={item.path} className="image-holder"><a className="image-link" title={ item.numMediaLabel }>
      {item.hasImage && <Image loader={defaultImageLoader} src={item.firstImage.preview} alt={item.alt} width={item.firstImage.calcWidth('preview')} height={item.firstImage.calcHeight('preview')} objectFit='contain' layout='intrinsic' />}
      </a></Link>
    <figcaption>
    <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
    <p>{item.typeYearLabel}</p>
    <p>{item.tagList}</p>
    </figcaption>
  </figure>
}

export default ArtwworkFigure;