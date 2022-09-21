import Image from "next/image";
import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";
import { defaultImageLoader } from "../../lib/utils";
import TagList from "./tag-list";


const FigureResultPreview = ({ item, index }: { item: NodeEntity, index: number }) => {
  const title = `${(index + 1)}) ${item.title} (${item.typeYearLabel})`; 
  const figStyles = item.hasImage ? item.firstImage.calcAspectStyle() : {};
  return (
    <figure title={title} className='node' style={figStyles}>
      <Link href={item.path}><a className="image-link">
        {item.hasImage && <Image loader={defaultImageLoader} src={item.firstImage.preview} alt={item.alt} width={item.firstImage.calcWidth('preview')} height={item.firstImage.calcHeight('preview')} />}
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