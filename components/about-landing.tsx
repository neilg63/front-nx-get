import { NextPage } from "next";
import Link from 'next/link';
import { BaseEntity } from "../lib/interfaces";
import { MediaItem, NodeEntity, PageDataSet } from "../lib/entity-data";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";
import labels from "../lib/labels";
import parse from "html-react-parser"
import Head from "next/head";
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import { useRouter } from "next/router";
import AboutNav from "./widgets/about-nav";

const AboutLanding: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  console.log(entity);
  const router = useRouter();
  const currentPathRef = router.asPath;
  const pathParts = currentPathRef.substring(1).split('/');
  const currentPath = pathParts.length < 2 ? '/about/bio' : currentPathRef;
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='about-landing'>
      <AboutNav current={currentPath} />
      <article>
          <h2>{entity.title}</h2>
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
}

export default AboutLanding;