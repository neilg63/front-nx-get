import Link from "next/link";
import { NodeEntity } from "../../lib/entity-data";
import MiniRelatedItem from "./mini-related-item";
import PressPreview from "./press-preview";

const TextResultPreview = ({ item, index, downloadLabel }: { item: NodeEntity, index: number, downloadLabel: string }) => {
  const title = (index + 1).toString();
  const isPress = item.type === 'press';
  // <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' dateMode='year' showLocation={true} />
  const dateMode = item.type === 'exhibition' ? 'year' : 'short';
  const showDate = ['press', 'essay'].includes(item.type) === false;
  const showLocation = item.type === 'exhibition';
  return (
    <article className='column' title={title}>
      {isPress ? <PressPreview item={item} label={downloadLabel} dateMode='none' /> : <MiniRelatedItem item={item} mode='basic' dateMode={dateMode} showDate={showDate} showLocation={showLocation} />}
    </article>
  )
}

export default TextResultPreview;