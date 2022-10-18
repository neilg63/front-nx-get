import { mediumDate, shortDate } from "../../lib/converters"
import { NodeEntity } from "../../lib/entity-data"
import DownloadLink from "./download-link"


const PressPreview = ({ item, label, dateMode }: { item: NodeEntity; label: string; dateMode: string }) => { 
  const showDate = ['medium', 'short'].includes(dateMode);
  const dateStr = showDate ? dateMode == 'medium' ? mediumDate(item.field_date) : shortDate(item.field_date) : '';
  return <div className='related-mini' key={item.uuid}>
    {showDate && <time>{dateStr}</time>}
      <h3><em className='text'>{item.title}</em> <span className='source'>{item.field_source}</span></h3>
    {item.hasDocument && <DownloadLink item={item.field_document!} label={ label } />}
  </div>
}

PressPreview.defaultProps = {
  dateMode: 'medium'
};

export default PressPreview;