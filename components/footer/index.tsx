import Link from "next/link";
import { SimpleMenuItem, SiteInfo } from "../../lib/api-view-results";
import styles from './styles.module.scss';

const Footer = ({ site }: {site: SiteInfo}) => {
  const menu = site.menus.footer;
  return (
    <footer className='container'>
      <div className={styles.wrapper}>
        <nav>
          <ul>
            {menu.map((item: SimpleMenuItem) => {
              return <li key={item.path}>
                <Link href={item.path}><a>{item.title}</a></Link>
              </li>
            })}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer;