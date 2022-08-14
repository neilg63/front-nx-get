import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { BaseEntity, SiteInfo } from "../lib/api-view-results";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import Paginator from "./widgets/paginator";

const ArtworkList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items } = pageData
  const hasItems = items instanceof Array && items.length > 0;
  return <section className="artwork-list">
    {hasItems && <><ul>
        {items.map(item => <li key={item.uuid}>
            <Link href={item.path}><a>
              {item.hasImage && <img src={item.firstImage.preview} alt={item.title} />}
              <span className="text">{item.title}</span>
            </a></Link>
          </li>)} 
      </ul>
      <Paginator pageData={pageData} maxLinks={10} />
    </>}
  </section>
}

export default ArtworkList;