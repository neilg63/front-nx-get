import Head from 'next/head';
import { BaseEntity, SiteInfo } from '../../lib/api-view-results';
import { NodeEntity, PageDataSet } from '../../lib/entity-data';
import { MetaDataSet } from '../../lib/ui-entity';
import Footer from '../footer';
import Header from "../header";

export interface LayoutProps {
  site: SiteInfo,
  items?: NodeEntity[],
  entity?: NodeEntity,
  children?: React.ReactNode,
  wrapperClasses?: string
  meta: MetaDataSet
}

const Layout = (data: BaseEntity) => {
  const { children } = data;
  const wrapperClasses = '';
  const pageData = new PageDataSet(data)
  const { site, meta } = pageData;

  console.log(site.menus.main)
  const footer = site instanceof Object ? site.menus.footer : [];
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
        <Header site={site}/>
          {children}
        <Footer menu={footer}/>
      </div>
      
      <script src="/js/global.js" defer={true} />
    </>
  );
};

export default Layout;