import contentTypes from "../../lib/content-types"
import parse from "html-react-parser";
import { NodeEntity } from "../../lib/entity-data"
import { relatedKey } from "../../lib/ui-entity"
import Carousel from "./carousel"
import MiniRelatedItem from "./mini-related-item"
import RelatedItem from "./related-item"
import TypeLink from "./type-link"
import YearLink from "./year-link"
import TagList from "./tag-list";
import BreadcrumbTitle from "./breadcrumb-title";

const ArtworkInsert = ({ entity, basePath }: { entity: NodeEntity, basePath: string }) => { 

  return <>
    <article className="artwork">
        <header>
        <h1><BreadcrumbTitle path={entity.path} title={ entity.title } /></h1>
          {entity.hasSubtitle && <h3 className="subitlte">{parse(entity.field_subtitle)}</h3>}
        </header>
        {entity.hasImages && <Carousel items={entity.images} />}
        <div className="info">
          <p className="year-type links-2"><TypeLink value={entity.field_type} basePath={basePath} /> <YearLink value={entity.field_year} basePath={basePath} /></p>
          {entity.hasBody && <div className="body">{parse(entity.body)}</div>}
          <TagList terms={entity.field_tags} base={basePath} prefix="tag" />
        </div>
      </article>
      <aside className='sidebar sidebar-right'>
        {entity.hasRelatedExhibitions && <div className='related-exhibitions related'>
          <h3>{contentTypes.exhibition}</h3>
          <div className='columns'>
            {entity.field_related_exhibitions.map((row: NodeEntity, index: number) => <RelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>}
        {entity.hasRelatedEssays && <div className='related-essays related'>
          <h3>{contentTypes.article}</h3>
          <div className='columns'>
            {entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>}
        {entity.hasRelatedPresss && <div className='related-press related'>
          <h3>{contentTypes.press}</h3>
          <div className='columns'>
            {entity.field_related_press.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} />)}
          </div>
        </div>}
      </aside>
  </>

}

export default ArtworkInsert;