import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/api-view-results";
import { NodeEntity, PageDataSet } from "../lib/entity-data";
import { mediumDate } from "../lib/converters";

const NewsList: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { items } = pageData;
  const hasItems = items.length > 0;
  return <section className="news-list">
    {hasItems && <ul>
      {items.map((item: NodeEntity) => <li key={item.uuid}>
        <time>{ mediumDate(item.field_date) }</time>
          <h3><Link href={item.path}><a>
            {item.hasImage && <img src={item.firstImage.preview} alt={item.title} />}  
            <span className="text">{item.title}</span>
          </a></Link></h3>
          <summary>{item.summary}</summary>
        </li>)} 
      </ul>}
  </section>
}

export default NewsList;