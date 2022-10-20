import { MetaDataSet } from "../../lib/ui-entity";

const SeoHead = ({ meta }: { meta: MetaDataSet }) => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{meta.title}</title>
      <link rel="shortcut icon" href="/assets/favicon.ico?v=6" type="image/x-icon"></link>
      <meta property="og:type" content="article" />
      <meta property="og:title" content={meta.title} />
      <meta property="twitter:title" content={meta.title} />
      <meta name="description" content={meta.description} />
      <meta property="og:description" content={meta.description} />
      <meta property="twitter:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={meta.image} />
    </>
  );
};

export default SeoHead;