import { MediaItem } from "../../lib/entity-data";
import { notEmptyString } from "../../lib/utils";

const DownloadLink = ({ item, label }: { item: MediaItem, label: string }) => {
  const hasValue = item instanceof MediaItem && notEmptyString(item.uri, 5);
  return (
    <>
      { hasValue && 
        <p className="downloadable"><a href={item.src} download={true} target='_blank' rel='noreferrer'>{label}</a></p>
    }
    </>
  );
};

export default DownloadLink;