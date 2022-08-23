import { Input } from '@nextui-org/react';
import { useState } from "react";
import Link from 'next/link';
import { toAlias } from '../../lib/converters';
import { SiteInfo, PageDataSet, SimpleMenuItem } from '../../lib/entity-data';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';

const renderClassNames = (item: SimpleMenuItem): string => {
  const alias = toAlias(item.path);
  const parts = alias.split('/');
  const cls = [['section', parts[0]].join('--')];
  if (parts.length > 1) {
    cls.push(['sub', parts[0], parts[1]].join('--'));
    if (parts.length > 2) {
      cls.push(['page', ...parts].join('--'));
    }
  }
  return cls.join(' ');
}

const isHomeLink = (item: SimpleMenuItem): boolean => {
  return toAlias(item.path) === 'home';
}

const Header = (pageData: PageDataSet) => {
  const { site } = pageData;
  const mainItems = site instanceof Object && site.menus instanceof Object? site.menus.main : [];
  const hasMenuItems = mainItems instanceof Array && mainItems.length > 0;
  const [search, setSearch] = useState('');
  const router = useRouter();

  const updateSearch = (e: any) => {
    if (e instanceof Object) {
      const { target } = e;
      if (target instanceof Object) {
        setSearch(target.value);
      }
    }
  }

  const submitSearch = () => {
    const path = ['/search', encodeURIComponent(search)].join('/');
    router.push(path);
  }

  return (
    <header className='header'>
      <Link href={'/'}><a className='logo'></a></Link>
      <nav className='top-nav'>
        {hasMenuItems && <ul>
          {mainItems.map(item => {
            return <li key={item.path} className={ renderClassNames(item)  }>
              <Link href={item.path}><a>{isHomeLink(item) ? <i className='icon icon-home' title={ item.title }></i> : item.title }</a></Link>
            </li>
          })}
          <li className="search-link">
            <Input name='search' value={search} onChange={updateSearch} className='search-field' size='sm' />
            <i className='icon icon-search' title='Search' onClick={submitSearch}></i>
          </li>
        </ul>}
      </nav>
      <div className='expand-nav icon-hamburger'></div>
    </header>
  );
}

export default Header;