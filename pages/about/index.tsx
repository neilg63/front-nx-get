import type { NextPage, GetServerSideProps } from 'next'
import parse from "html-react-parser"
import Image from 'next/image'
import { MediaItem, PageDataSet } from '../../lib/entity-data';
import { BaseEntity } from '../../lib/interfaces';
import { fetchFullNode } from '../../lib/api-view-results';
import { Container } from '@nextui-org/react';
import { defaultImageLoader } from '../../lib/utils';
import Head from 'next/head';
import SeoHead from '../../components/layout/head';

const About: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  return (
    <>
      <Head>
        <SeoHead meta={meta} />
      </Head>
      <Container >
        <article>
          <h1>{entity.title}</h1>
          <div className="body">{parse(entity.body)}</div>
          {entity.hasImages && <section className="media-items">
            {entity.images.map((item: MediaItem) => <figure key={item.uri} data-key={item.uri} data-dims={item.dims('medium')}>
              <Image loader={defaultImageLoader}  sizes={item.srcSet} src={item.medium} alt={item.alt} width={item.calcWidth('medium')} height={item.calcHeight('medium')} />
              <figcaption>{item.field_credit}</figcaption>
            </figure>)}
          </section>}
        </article>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const page = await fetchFullNode('about');
  return {
    props: page
  }
}

export default About
