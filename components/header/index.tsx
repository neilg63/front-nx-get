import Link from 'next/link';
import { BaseEntity, SiteInfo } from '../../lib/api-view-results';
import { PageDataSet } from '../../lib/entity-data';
import styles from './styles.module.scss';

const Header = (data: BaseEntity) => {
  const pageData = new PageDataSet(data)
  const { site } = pageData;
  const main = site instanceof SiteInfo ? site.menus.main : [];
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