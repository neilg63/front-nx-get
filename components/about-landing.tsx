import { NextPage } from "next";
import { BaseEntity } from "../lib/interfaces";
import { MediaItem, PageDataSet } from "../lib/entity-data";
import Image from "next/image";
import { defaultImageLoader } from "../lib/utils";
import parse from "html-react-parser"
import SeoHead from "./layout/head";
import { Container } from "@nextui-org/react";
import { containerProps } from "../lib/styles";
import { useRouter } from "next/router";
import AboutNav from "./widgets/about-nav";

const AboutLanding: NextPage<BaseEntity> = (data) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const router = useRouter();
  const currentPathRef = router.asPath;
  const pathParts = currentPathRef.substring(1).split('/');
  const currentPath = pathParts.length < 2 ? '/about/bio' : currentPathRef;
  return <>
    <SeoHead meta={meta} />
    <Container {...containerProps} className='about-landing left-align listing-main'>
      <AboutNav current={currentPath} />
      <article className='about-article grid-half-header'>
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