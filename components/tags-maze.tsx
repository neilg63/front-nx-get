import { Container, Tooltip } from "@nextui-org/react"
import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { PageDataSet, SimpleTerm } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import labels from "../lib/labels";
import SeoHead from "./layout/head";
import { containerProps } from "../lib/styles";

const numRelatedLabel = (numRelated = 0) => {
  const pl = numRelated === 1 ? '' : 's';
  return numRelated > 0? `${numRelated} related artwork${pl}` : '';
}

const toKey = (prefix = '', slug = '', index = 0) => {
  return [prefix, slug, index].join('-');
}


const TagsMaze: NextPage<BaseEntity> = (data: BaseEntity) => {
  const pageData = new PageDataSet(data);
  return <>
    <Head>
        <SeoHead meta={pageData.meta} />
      </Head>
    <Container {...containerProps} className='tags-container'>
      <h2>{ labels.tag_list_title}</h2>
      <ul className='tag-list'>
        {pageData.hasItems && pageData.items.map((item: SimpleTerm, index: number) => {
          return <li key={toKey('tag', item.slug, index)}>
              <Tooltip content={numRelatedLabel(item.num_related)} rounded={false} shadow={false} className='bordered'><Link href={item.path}><a>{item.title}</a></Link></Tooltip>
            </li>
          })}
      </ul>
    </Container>
  </>
}

export default TagsMaze;