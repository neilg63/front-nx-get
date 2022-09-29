import contentTypes, { relatedItemsTitle } from "../../lib/content-types"
import parse from "html-react-parser";
import { NodeEntity, SiteInfo } from "../../lib/entity-data"
import { MetaDataSet, relatedKey } from "../../lib/ui-entity"
import Carousel from "./carousel"
import MiniRelatedItem from "./mini-related-item"
import TypeLink from "./type-link"
import YearLink from "./year-link"
import TagList from "./tag-list";
import BreadcrumbTitle from "./breadcrumb-title";
import ArtworkFigure from "./artwork-figure";
import { ShareWidget } from "./share-widget";
import { notEmptyString } from "../../lib/utils";

const ArtworkInsert = ({ entity, basePath, site, meta }: { entity: NodeEntity, basePath: string, site: SiteInfo, meta: MetaDataSet}) => { 
  const hasMeta = meta instanceof MetaDataSet;
  const materialLabel = site.label('material_label', 'Material');
  const dimensionsLabel = site.label('dimensions_label', 'Dimensions');
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
        {entity.hasTextField('material_text') && <p><strong className='text-label'>{ materialLabel}</strong><span className=''>{entity.field_material_text}</span></p>}
        {entity.hasTextField('dimensions') &&  <p><strong className='text-label'>{ dimensionsLabel }</strong><span className=''>{entity.field_dimensions}</span></p>}
        {hasMeta && <ShareWidget meta={meta} />}
        </div>
      </article>
      <aside className='sidebar sidebar-right'>
        {entity.hasRelatedExhibitions && <div className='related-exhibitions related'>
          <h3>{contentTypes.exhibition}</h3>
          <div className='column'>
            {entity.field_related_exhibitions.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
        {entity.hasRelatedEssays && <div className='related-essays related'>
          <h3>{contentTypes.article}</h3>
          <div className='column'>
            {entity.field_related_essays.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
        {entity.hasRelatedPress && <div className='related-press related'>
          <h3>{contentTypes.press}</h3>
          <div className='column'>
            {entity.field_related_press.map((row: NodeEntity, index: number) => <MiniRelatedItem key={relatedKey(row, index)} item={row} mode='basic' />)}
          </div>
        </div>}
    </aside>
    {entity.hasRelatedArtworks && <div className='related-artworks related artwork-list'>
          <h3>{relatedItemsTitle('artwork')}</h3>
        <div className='fixed-height-rows medium-height inner-captions'>
        {entity.related_artworks.map((row: NodeEntity, index: number) => <ArtworkFigure key={relatedKey(row, index)} item={row} index={ index } />)}
        </div>
      </div>}
  </>

}

ArtworkInsert.defaultProps = {
  meta: null
};


export default ArtworkInsert;