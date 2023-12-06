
import Head from "next/head";
import { MetaDataSet } from "../../lib/ui-entity";


const SeoHead = ({ meta }: { meta: MetaDataSet }) => {
  return (
    <Head>
      <title key="title">{meta.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" key="icon-device-size" />
      <link rel="shortcut icon" href="/fv/favicon.ico?v=6" type="image/x-icon" key="icon-shortcut" />
      <link rel="apple-touch-icon" sizes="180x180" href="/fv/apple-touch-icon.png" key="icon-touch" />
      <link rel="icon" type="image/png" sizes="32x32" href="/fv/favicon-32x32.png" key="icon-png-32"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/fv/favicon-16x16.png" key="icon-png-16" />
      <link rel="manifest" href="/fv/site.webmanifest" key="web-manifest"/>
      <meta property="og:type" content="article" key="article-type" />
      <meta property="og:title" content={meta.title} key="og-title" />
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:image" content={meta.image} key="twitter-image" />
      <meta property="og:image" content={meta.image} key="og-image" />
      <meta property="twitter:title" content={meta.title} key="twitter-title" />
      <meta name="description" content={meta.description} key="page-description" />
      <meta property="og:description" content={meta.description} key="og-description" />
      <meta name="twitter:description" content={meta.description} key="twitter-description" />
    </Head>
  );
};

export default SeoHead;