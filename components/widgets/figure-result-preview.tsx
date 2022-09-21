import { Image } from "@nextui-org/react";
import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";

const FigureResultPreview = ({ item, index }: { item: NodeEntity, index: number }) => {
  const title = `${(index + 1)}) ${item.title} (${item.typeYearLabel})`; 
  const figStyles = item.hasImage ? item.firstImage.calcAspectStyle() : {};
  return (
    <figure title={title} className='node' style={figStyles}>
      <Link href={item.path}><a className="image-link"  style={item.firstImage.calcAspectStyle()}>
        {item.hasImage && <Image src={item.firstImage.preview} alt={item.alt} width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} />}
        <figcaption>
          <h3>{item.title}</h3>
          {item.hasArtType && <p>{item.artType}</p>}
          <p>{item.typeYearLabel}</p>
        </figcaption>
      </a></Link>
    </figure>
  )
}

export default FigureResultPreview;