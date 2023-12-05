
import { MetaDataSet } from "../../lib/ui-entity";

const SeoHead = ({ meta }: { meta: MetaDataSet }) => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/fv/favicon.ico?v=6" type="image/x-icon" />
      <link rel="apple-touch-icon" sizes="180x180" href="/fv/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/fv/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/fv/favicon-16x16.png" />
      <link rel="manifest" href="/fv/site.webmanifest" />
      <meta property="og:type" content="article" key="article-type" />
      <meta property="og:title" content={meta.title} key="og-title" />
      <meta property="twitter:title" content={meta.title} key="twitter-title" />
      <meta name="description" content={meta.description} key="page-description" />
      <meta property="og:description" content={meta.description} key="og-description" />
      <meta property="twitter:description" content={meta.description} key="twitter-description" />
      <meta property="og:image" content={meta.image} key="og-image" />
      <meta property="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:image" content={meta.image} key="twitter-image" />
    </>
  );
};

export default SeoHead;