import { Image } from "@nextui-org/react";
import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";
import { smartCastInt, truncateText } from "../../lib/utils";

const PublicationItem = ({ item, index }: { item: NodeEntity, index: number }) => {
  const title = truncateText(item.title, 64, '...');
  const className = item.hasImage ? 'node' : 'aspect-4-3';
  const hasYear = smartCastInt(item.field_year, 0) > 1000;
  return <figure key={[item.uuid, index].join('-')} className={className}>
      <Link href={item.path} className="image-holder"><a className="image-link"  style={item.firstImage.calcAspectStyle()}>
        {item.hasImage ? <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} /> : <div className='frame'></div>}
        <figcaption>
          <h4>{title}</h4>
          {hasYear && <p className='year'>{item.field_year}</p>}
      </figcaption>  
      </a></Link>
      
  </figure>
}

export default PublicationItem;