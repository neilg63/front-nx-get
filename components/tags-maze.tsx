import { Container } from "@nextui-org/react"
import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { PageDataSet, SimpleTerm } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import labels from "../lib/labels";
import SeoHead from "./layout/head";
import { containerProps } from "../lib/styles";
import { useContext, useEffect } from "react";
import { TopContext } from "../pages/_app";
import { useRouter } from "next/router";

const numRelatedLabel = (numRelated = 0) => {
  const pl = numRelated === 1 ? '' : 's';
  return numRelated > 0? `${numRelated} related artwork${pl}` : '';
}

const toKey = (prefix = '', slug = '', index = 0) => {
  return [prefix, slug, index].join('-');
}


const TagsMaze: NextPage<BaseEntity> = (data: BaseEntity) => {
  const pageData = new PageDataSet(data);
  const context = useContext(TopContext);
  const router = useRouter();
  useEffect(() => {
     if (context) {
      if (context.escaped) {
        router.back();
      }
    }
  }, [context, router])
  return <>
    <Head>
        <SeoHead meta={pageData.meta} />
      </Head>
    <Container {...containerProps} className='tags-container'>
      <h2 className='seo-hide'>{ labels.tag_list_title}</h2>
      <div className='tag-list'>
        {pageData.hasItems && pageData.items.map((item: SimpleTerm, index: number) => {
          return <span key={toKey('tag', item.slug, index)} title={numRelatedLabel(item.num_related)} className='tag'>
              <Link href={item.path}><a>{item.title}</a></Link>
            </span>
          })}
      </div>
    </Container>
  </>
}

export default TagsMaze;