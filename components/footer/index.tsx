import Link from "next/link";
import { SimpleMenuItem, SiteInfo } from "../../lib/api-view-results";
import styles from './styles.module.scss';

const Footer = ({ site }: {site: SiteInfo}) => {
  const menuItems = site instanceof Object && site.menus instanceof Object && site.menus.footer instanceof Array ? site.menus.footer : [];
  const hasMenuItems = menuItems.length > 0;
  return (
    <footer className='container footer'>
      <div className={styles.wrapper}>
        <nav className='footer-nav'>
          {hasMenuItems && <ul className='menu footer-menu row'>
            {menuItems.map((item: SimpleMenuItem) => {
              return <li key={item.path}>
                <Link href={item.path}><a>{item.title}</a></Link>
              </li>
            })}
          </ul>}
        </nav>
      </div>
    </footer>
  )
}

export default Footer;