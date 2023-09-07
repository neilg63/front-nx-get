
import { MetaDataSet } from "../../lib/ui-entity";

const SeoHead = ({ meta }: { meta: MetaDataSet }) => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/assets/favicon.ico?v=6" type="image/x-icon"></link>
      <meta property="og:type" content="article" key="article-type" />
      <meta property="og:title" content={meta.title} key="og-title" />
      <meta property="twitter:title" content={meta.title} key="twitter-title" />
      <meta name="description" content={meta.description} key="page-description" />
      <meta property="og:description" content={meta.description} key="og-description" />
      <meta property="twitter:description" content={meta.description} key="twitter-description" />
      <meta property="og:image" content={meta.image} key="og-image" />
      <meta property="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:image" content={meta.image} key="twitter-image" />
      {/* <script async src="/js/row-grid.js"></script> */}
    </>
  );
};

export default SeoHead;