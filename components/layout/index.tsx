import Head from 'next/head';
import { BaseEntity } from '../../lib/interfaces';
import { PageDataSet } from '../../lib/entity-data';

const Layout = (data: BaseEntity) => {
  const pageData = new PageDataSet(data)
  const { meta } = pageData;
  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
    </>
  );
};

export default Layout;