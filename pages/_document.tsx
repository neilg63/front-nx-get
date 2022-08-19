import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@nextui-org/react';
import { PageDataSet } from '../lib/entity-data';
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
        <Head title={ meta.title }>
          {CssBaseline.flush()}
          <link rel="stylesheet" href="/icomoon/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;