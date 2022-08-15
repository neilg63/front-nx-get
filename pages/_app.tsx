import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { NextUIProvider } from '@nextui-org/react';
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import styles from '../styles/Home.module.scss'

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
  setHeight: Function;
  setWidth: Function;
}

export const TopContext = React.createContext<AppContextInterface | null>(null);

const buildWrapperClass = (asPath: string) => {
  const pathParts = asPath.substring(1).split('/');
  const sectionClass = pathParts[0].length < 2? 'home' : pathParts[0];
  const wrapperClasses = ['main-wrapper',['section', sectionClass].join('--')];
  if (pathParts.length > 1) {
    wrapperClasses.push(['sub', pathParts.slice(0,2).join('-')].join('--'));
  }
  return wrapperClasses.join(' ');
}

export default function App({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const wrapperClassName = buildWrapperClass(asPath);
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    setHeight(window.outerHeight);
    setWidth(window.outerWidth);
  }, [])

  const queryClientRef = React.useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }
  return   <QueryClientProvider client={queryClientRef.current}>
    <Hydrate state={pageProps.dehydratedState}>
      <TopContext.Provider value={{
      height,
      width,
      setHeight,
      setWidth,
        }}>
       <NextUIProvider {...pageProps}>
           <Component {...pageProps } path={asPath} />
        </NextUIProvider>
    </TopContext.Provider>
    </Hydrate>
  </QueryClientProvider>
}
