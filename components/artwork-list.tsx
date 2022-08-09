import { NextPage } from "next";
import { JsonApiResource } from "next-drupal";
import parse from "html-react-parser";
import Link from 'next/link';
import { extractPreviewImage, hasPreviewImage, toImageSrc, toImageSrcSet } from "../lib/ui-entity";
import { SiteInfo } from "../lib/api-view-results";

const ArtworkList: NextPage<{items: JsonApiResource[], siteData: SiteInfo }> = ({items} ) => {  
  const hasItems = items.length > 0;
  return <section className="artwork-list">
    {hasItems && <ul>
        {items.map(item => <li key={item.uuid}>
          <Link href={item.path}><a>
            {hasPreviewImage(item) && <img src={extractPreviewImage(item)} alt={item.title} />}  
            <span className="text">{item.title}</span>
          </a></Link>
        </li>)} 
      </ul>}
  </section>
}

export default ArtworkList;