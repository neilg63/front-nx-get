import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@nextui-org/react';
import { PageDataSet } from '../lib/entity-data';
import Header from '../components/header';
import { isObjectWith } from '../lib/utils';

class AppDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles])
    };
  }
  
  render() {
    const { __NEXT_DATA__ } = this.props;
    const { props } = __NEXT_DATA__;
    const data: any = isObjectWith(props, 'pageProps')? props.pageProps : {};
    const pageData = new PageDataSet(data)
    const { meta } = pageData;
    return (
      <Html lang="en">
        <Head title={meta.title}>
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
          {CssBaseline.flush()}
        </Head>
        <body>
          <Header {...pageData} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;