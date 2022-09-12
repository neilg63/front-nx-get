import { Input } from '@nextui-org/react';
import { useCallback, useContext, useEffect, useState } from "react";
import Link from 'next/link';
import { toAlias } from '../../lib/converters';
import { PageDataSet, SimpleMenuItem } from '../../lib/entity-data';
import { useRouter } from 'next/router';
import { notEmptyString } from '../../lib/utils';
import { TopContext } from '../../pages/_app';
import labels from '../../lib/labels';
import { toLocal } from '../../lib/localstore';

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
  switch (parts[0]) {
    case 'search':
    case 'home':
      cls.push('prominent');
      break;
    default:
      cls.push('inner');
      break;
  }
  const aliasStart = item.path.length > 1 ? item.path.substring(1).split('/').shift()! : '';
  if (aliasStart === subAlias) {
    cls.push('active');
  }
  return cls.join(' ');
}

const renderTarget = (item: SimpleMenuItem): string => {
  if (item.path.startsWith('https://')) {
    return '_blank';
  } else {
    return '_self';
  }
}

const isHomeLink = (item: SimpleMenuItem): boolean => {
  return toAlias(item.path) === 'home';
}

const Header = (pageData: PageDataSet) => {
  const { site } = pageData;
  const context = useContext(TopContext);
  const [mainItems, setMainItems] = useState<SimpleMenuItem[]>([]);
  const [hasMenuItems, setHasMenuItems] = useState(false);
  const [subAlias, setSubAlias] = useState('/');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [searchClassNames, setSearchClassNames] = useState('search-link prominent');
  const [classNames, setClassNames] = useState('header');
  const router = useRouter();

  const submitSearch = () => {
    if (notEmptyString(search, 1)) {
      const path = ['/search', encodeURIComponent(search.toLowerCase())].join('/');
      toLocal('current_search_string', search);
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

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const updateSearchClassNames = useCallback((searchStr = '') => {
    const cls = ['search-link prominent'];
    if (searchStr.length > 1) {
      cls.push('expanded');
    }
    const newCln = cls.join(' ');
    if (newCln !== searchClassNames) {
      setSearchClassNames(newCln);
    }
  }, [searchClassNames])

  useEffect(() => {
    const items = site instanceof Object && site.menus instanceof Object ? site.menus.main : [];
    const path = router.asPath;
    
    router.events.on('routeChangeComplete', (e) => {
      setExpanded(false);
    });
    const sub = typeof path === 'string' && path.length > 1 ? path.substring(1).split('/').shift()! : '';
    const cls = ['header'];
    if (expanded) {
      cls.push('show-menu');
    }
    setClassNames(cls.join(' '));
    if (context) {
      if (context.escaped) {
        setExpanded(false);
      }
    }
    setSubAlias(sub);
    setMainItems(items);
    setHasMenuItems(items instanceof Array && items.length > 0);
    updateSearchClassNames(search);
  }, [site, setSubAlias, router, expanded, context, search, updateSearchClassNames])

  return (
    <header className={classNames}>
      <Link href={'/tags'}><a className='logo'></a></Link>
      <nav className='top-nav'>
        {hasMenuItems && <ul>
          {mainItems.map(item => {
            return <li key={item.path} className={ renderClassNames(item, subAlias)  }>
              <Link href={item.path}><a target={ renderTarget(item) }>{isHomeLink(item) ? <i className='icon icon-home' title={ item.title }></i> : item.title }</a></Link>
            </li>
          })}
          <li className={searchClassNames}>
            <Input name='search' value={search} onChange={updateSearch} className='search-field' size='sm' onKeyDown={e => (submitOnEnter(e))} id='nav-short-search-field' aria-labelledby={ labels.search}/>
            <i className='icon icon-search' title='Search' onClick={submitSearch}></i>
          </li>
        </ul>}
      </nav>
      <div className='expand-nav icon-hamburger' onClick={() => toggleExpanded()}></div>
    </header>
  );
}

export default Header;