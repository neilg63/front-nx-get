import Link from 'next/link';
import { BaseEntity, SiteInfo } from '../../lib/api-view-results';
import { PageDataSet } from '../../lib/entity-data';
import styles from './styles.module.scss';

const Header = (pageData: PageDataSet) => {
  const { site } = pageData;
  const mainItems = site instanceof Object && site.menus instanceof Object? site.menus.main : [];
  const hasMenuItems = mainItems instanceof Array && mainItems.length > 0;
  return (
    <header className='header'>
      <Link href={'/'}><a className='logo'></a></Link>
      <nav className='top-nav'>
        {hasMenuItems && <ul>
          {mainItems.map(item => {
            return <li key={item.path}>
              <Link href={item.path}><a>{item.title}</a></Link>
            </li>
          })}
        </ul>}
      </nav>
      <div className='expand-nav icon-hamburger'></div>
    </header>
  );
}

export default Header;