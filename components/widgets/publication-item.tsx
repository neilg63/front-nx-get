import { Image } from "@nextui-org/react";
import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";
import { notEmptyString } from "../../lib/utils";

const PublicationItem = ({ item, index }: { item: NodeEntity, index: number }) => {
  return <figure key={[item.uuid, index].join('-')} className='node'>
      <Link href={item.path} className="image-holder"><a className="image-link"  style={item.firstImage.calcAspectStyle()}>
        {item.hasImage ? <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} /> : <div className='frame'></div>}
        <figcaption>
          <h4>{item.title}</h4>
          <p className='year'>{item.field_year}</p>
      </figcaption>  
      </a></Link>
      
  </figure>
}

export default PublicationItem;