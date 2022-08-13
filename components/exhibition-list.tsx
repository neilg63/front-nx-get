import { NextPage } from "next";
import parse from "html-react-parser";
import Link from 'next/link';
import { MetaDataSet } from "../lib/ui-entity";
import { BaseEntity, SiteInfo } from "../lib/api-view-results";
import { NodeEntity, PageDataSet } from "../lib/entity-data";

const ExhibitionList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const hasItems = pageData.items.length > 0;
  const { items } = pageData;
  return <section className="exhibition-list">
    {hasItems && <ul>
        {items.map(item => <li key={item.uuid}>
          <Link href={item.path}><a>
            {item.hasImage && <img src={item.firstImage.size('max_650x650')} alt={item.title} />}  
            <span className="text">{item.title}</span>
          </a></Link>
        </li>)} 
      </ul>}
  </section>
}

export default ExhibitionList;