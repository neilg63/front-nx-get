import Head from 'next/head';
import { BaseEntity } from '../../lib/api-view-results';
import { PageDataSet } from '../../lib/entity-data';
import Footer from '../footer';
import Header from "../header";

const Layout = (data: BaseEntity) => {
  const { children } = data;
  const wrapperClasses = '';
  const pageData = new PageDataSet(data)
  const { site, meta } = pageData;
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <link rel="shortcut icon" href="/favicon.ico?v=6" type="image/x-icon"></link>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={meta.title} />
        <meta property="twitter:title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <meta property="og:description" content={meta.description} />
        <meta property="twitter:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={meta.image} />
      </Head>
      
      <div className={wrapperClasses}>
        <Header {...pageData} />
          {children}
        <Footer site={site} />
      </div>
    </>
  );
};

export default Layout;