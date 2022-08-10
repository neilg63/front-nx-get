import type { NextPage, GetStaticPropsContext, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteInfo, SimpleMenuItem, SiteInfo } from '../lib/api-view-results'

const Home: NextPage<{site: SiteInfo}> = ({site} ) => {
  const { main, footer } = site.menus;
  return (
    <>
      {main.map((item) => {
        return <li key={item.path}>
          <Link href={item.path}><a>{item.title}</a></Link>
        </li>
      })}
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const siteData = await getSiteInfo();
  return {
    props: {
      site: siteData
    },
    revalidate: false
  }
}

export default Home
