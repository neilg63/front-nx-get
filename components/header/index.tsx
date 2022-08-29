import { Input } from '@nextui-org/react';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { toAlias } from '../../lib/converters';
import { PageDataSet, SimpleMenuItem } from '../../lib/entity-data';
import { useRouter } from 'next/router';
import { notEmptyString } from '../../lib/utils';

const renderClassNames = (item: SimpleMenuItem, subAlias = ''): string => {
  const alias = toAlias(item.path);
  const parts = alias.split('/');
  const cls = [['section', parts[0]].join('--')];
  if (parts.length > 1) {
    cls.push(['sub', parts[0], parts[1]].join('--'));
    if (parts.length > 2) {
      cls.push(['page', ...parts].join('--'));
    }
  }
  const aliasStart = item.path.length > 1 ? item.path.substring(1).split('/').shift()! : '';
  if (aliasStart === subAlias) {
    cls.push('active');
  }
  return cls.join(' ');
}

const isHomeLink = (item: SimpleMenuItem): boolean => {
  return toAlias(item.path) === 'home';
}

const Header = (pageData: PageDataSet) => {
  const { site } = pageData;
  const [mainItems, setMainItems] = useState<SimpleMenuItem[]>([]);
  const [hasMenuItems, setHasMenuItems] = useState(false);
  const [subAlias, setSubAlias] = useState('/');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const submitSearch = () => {
    if (notEmptyString(search, 1)) {
      const path = ['/search', encodeURIComponent(search.toLowerCase())].join('/');
      router.push(path);
    }
  }

  const updateSearch = (e: any) => {
    if (e instanceof Object) {
      const { target } = e;
      if (target instanceof Object) {
        setSearch(target.value);
      }
    }
  }

  const submitOnEnter = (e: any) => {
    if (e instanceof Object) {
      if (e.keyCode) {
        if (e.keyCode === 13) {
          submitSearch();
        }
      }
    }
  }

  useEffect(() => {
    const items = site instanceof Object && site.menus instanceof Object ? site.menus.main : [];
    const path = router.asPath;
    const sub = typeof path === 'string' && path.length > 1 ? path.substring(1).split('/').shift()! : '';
    setSubAlias(sub);
    setMainItems(items);
    setHasMenuItems(items instanceof Array && items.length > 0);
  }, [site, setSubAlias, router])

  return (
    <header className='header'>
      <Link href={'/tags'}><a className='logo'></a></Link>
      <nav className='top-nav'>
        {hasMenuItems && <ul>
          {mainItems.map(item => {
            return <li key={item.path} className={ renderClassNames(item, subAlias)  }>
              <Link href={item.path}><a>{isHomeLink(item) ? <i className='icon icon-home' title={ item.title }></i> : item.title }</a></Link>
            </li>
          })}
          <li className="search-link">
            <Input name='search' value={search} onChange={updateSearch} className='search-field' size='sm' onKeyDown={e => (submitOnEnter(e))} />
            <i className='icon icon-search' title='Search' onClick={submitSearch}></i>
          </li>
        </ul>}
      </nav>
      <div className='expand-nav icon-hamburger'></div>
    </header>
  );
}

export default Header;