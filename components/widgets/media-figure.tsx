import { Image, ObjectFit } from "@nextui-org/react";
import { MediaItem } from "../../lib/entity-data";

const toMediaSrc = (item: MediaItem, size: string) => {
  switch (size) {
    case 'preview':
      return item.preview;
    case 'large':
      return item.large;
    default:
      return item.medium;
  }
}

const MediaFigure = ({ item, size, width, height, objectFit}: { item: MediaItem, size: string, width: string | number, height: string | number, objectFit: ObjectFit }) => {
  const src = toMediaSrc(item, size);
  return <figure className={size}><Image src={src} alt={item.alt} width={width} height={height} objectFit={objectFit} /></figure>
}


export default MediaFigure;