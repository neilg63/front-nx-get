import { NextPage } from "next";
import { PageDataSet } from "../lib/entity-data";
import { BaseEntity } from "../lib/interfaces";
import { containerProps } from "../lib/styles";
import { Container } from "@nextui-org/react";
import SeoHead from "./layout/head";
import Head from "next/head";
import ArtworkInsert from "./widgets/artwork-insert";

const ArtworkPage: NextPage<BaseEntity> = (data: BaseEntity) => {  
  const pageData = new PageDataSet(data);
  const { entity, meta } = pageData;
  const nextAlias = '/artworks';
  const basePath = '/artworks';
  return <>
    <Head>
      <SeoHead meta={meta} />
    </Head>
    <Container {...containerProps} className='grid-sidebar'>
      <ArtworkInsert entity={entity} basePath={basePath} />
    </Container>
  </>
}

export default ArtworkPage;