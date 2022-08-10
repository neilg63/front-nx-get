import type { NextPage, GetServerSideProps } from 'next'
import parse from "html-react-parser"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { MediaItem, NodeEntity, PageDataSet } from '../../lib/entity-data';
import { fetchFullNode, SiteInfo } from '../../lib/api-view-results';
import { MetaDataSet } from '../../lib/ui-entity';


const About: NextPage<PageDataSet> = ({ entity, site, meta} ) => {
  const images = entity.field_images instanceof Array ? entity.field_images : [];
  const hasImages = images.length > 0;
  return (
    <article>
      <h1>{entity.title}</h1>
      <h3 className="subtitle">{parse(entity.field_subtitle)}</h3>
      <div className="body">{parse(entity.body)}</div>
      {hasImages && images.map((item:MediaItem) => <figure key={item.uuid}>
        <img srcSet={item.toImageSrc()} src={item.size('max_1300x1300')} alt={item.alt} />
        <figcaption>{item.field_credit}</figcaption>
      </figure>)}
    </article>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const alias = 'about';
  const page = await fetchFullNode(alias);

  return {
    props: {
      page
    }
  }
}

export default About
