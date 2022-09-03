import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../public/icomoon/style.css";
import Header from '../components/header';
import Footer from '../components/footer';
import { customTheme } from '../lib/styles';

NProgress.configure({ showSpinner: false })

Router.events.on("routeChangeStart", function (path) {
  //§syncDrupalPreviewRoutes(path)
  NProgress.start()
})
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

export interface AppContextInterface {
  width: number;
  height: number;
  escaped: boolean;
  setHeight: Function;
  setWidth: Function;
  setEscaped: Function;
}

export const TopContext = React.createContext<AppContextInterface | null>(null);

const buildOuterContextClasses = (asPath: string) => {
  const pathParts = asPath.substring(1).split('/');
  const sectionClass = pathParts[0].length < 2? 'home' : pathParts[0];
  const wrapperClasses = ['gt-outer', ['section', sectionClass].join('--')];
  if (pathParts.length > 1) {
    wrapperClasses.push(['sub', pathParts.slice(0,2).join('-')].join('--'));
  }
  return wrapperClasses.join(' ');
}

export default function App({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const className = buildOuterContextClasses(asPath);
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(1200);
  const [escaped, setEscaped] = useState(false);

  const handleEscape = () => {
    setEscaped(true);
    setTimeout(() => {
      setEscaped(false);
    }, 500);
  }



  useEffect(() => {
    setHeight(window.outerHeight);
    setWidth(window.outerWidth);
    const handleKeyDown = (e: any) => {
      switch (e.which) {
        case 27:
          handleEscape();
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
  }, [])
  const { site } = pageProps;
  const queryClientRef = React.useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }
  const theme = createTheme({ ...customTheme, className });
  return   <QueryClientProvider client={queryClientRef.current}>
    <Hydrate state={pageProps.dehydratedState}>
      <TopContext.Provider value={{
        height,
       width,
        escaped,
        setHeight,
        setWidth,
        setEscaped
        }}>
        <NextUIProvider {...pageProps} theme={theme}>
            <Header {...pageProps} />
            <Component {...pageProps} path={asPath} />
            <Footer site={site} />
        </NextUIProvider>
    </TopContext.Provider>
    </Hydrate>
  </QueryClientProvider>
}
