import { Image, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data"
import { tooltipStyles } from "../../lib/styles";

const itemId = (id = '') => ['ap', id].join('-');

const TooltipContents = ({item}: {item: NodeEntity}) => {
  return <>
    <h3><Link href={item.path}><a>{item.title}</a></Link></h3>
    <p>{item.typeYearLabel}</p>
    <p>{item.tagList}</p>
  </>
}

const ArtworkFigure = ({ item, index }: { item: NodeEntity, index: number }) => {
  return <Tooltip id={itemId(item.uuid)} data-index={index} style={item.firstImage.calcAspectStyle()} className='node' content={<TooltipContents item={item} />} as='figure' rounded={false} shadow={false} placement='bottom' css={tooltipStyles} hideArrow={true}  offset={-24}>
  <Link href={item.path} className="image-holder"><a className="image-link" style={item.firstImage.calcAspectStyle()}>
      {item.hasImage && <Image src={item.firstImage.preview} alt={item.alt}  width={'auto'} height={'100%'} objectFit='contain' style={item.firstImage.calcAspectStyle()} />}
      </a></Link>
    <figcaption>
      <TooltipContents item={item} />
    </figcaption>
  </Tooltip>
}

export default ArtworkFigure;