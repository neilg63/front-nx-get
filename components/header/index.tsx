import Link from 'next/link';
import { SiteInfo } from '../../lib/api-view-results';
import styles from './styles.module.scss';

interface HeaderLayout {
  site: SiteInfo
}

const Header = ({site}: HeaderLayout) => {
  const main = site instanceof Object ? site.menus.main : [];
  return (
    <header className='header'>
      <nav className='top-nav'>
      {main.map(item => {
        return <li key={item.path}>
          <Link href={item.path}><a>{item.title}</a></Link>
        </li>
      })}
      </nav>
    </header>
  );
}

export default Header;