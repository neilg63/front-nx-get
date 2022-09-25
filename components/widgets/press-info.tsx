import parse from "html-react-parser";
import { SiteInfo } from "../../lib/entity-data";


const PressInfo = ({ site }: { site: SiteInfo }) => {
  const html = site.pressInfo().toString();
  const title = site.label('press_room');
  return (
    <>
      <div className='inner press-info'>
        <h3>{title }</h3>
        <div className='body'>{ parse(html)}</div>
      </div>
    </>
  );
};

export default PressInfo;