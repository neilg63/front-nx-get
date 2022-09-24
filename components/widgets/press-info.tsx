import parse from "html-react-parser";
import { SiteInfo } from "../../lib/entity-data";


const PressInfo = ({ site }: { site: SiteInfo }) => {
  const html = site.pressInfo().toString();
  return (
    <>
      <div className='inner press-info'>{ parse(html)}</div>
    </>
  );
};

export default PressInfo;