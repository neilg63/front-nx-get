import '../styles/globals.css'
import type { AppProps } from 'next/app'
import styles from '../styles/Home.module.scss'

function GtApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default GtApp
