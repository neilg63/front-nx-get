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
  const [searchFieldOn, setSearchFieldOn] = useState(false);
  const [subAlias, setSubAlias] = useState('/');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [searchClassNames, setSearchClassNames] = useState('search-link prominent');
  const [classNames, setClassNames] = useState('header');
  const router = useRouter();

  const isTagsMaze = router.asPath === '/tags';

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

  const handleTopLink = useCallback((e: any) => {
    if (e instanceof Object) {
      e.preventDefault();
      router.back();
    }
  }, [router])

  const updateSearchClassNames = useCallback((searchStr = '') => {
    const cls = ['search-link prominent'];
    if (searchStr.length > 0 || searchFieldOn) {
      cls.push('expanded');
    }
    const newCln = cls.join(' ');
    if (newCln !== searchClassNames) {
      setSearchClassNames(newCln);
    }
  }, [searchClassNames, searchFieldOn]);

  useEffect(() => {
    const items = site instanceof Object && site.menus instanceof Object ? site.menus.main : [];
    const path = router.asPath;
    /* setSearchFieldOn(path.startsWith("/search") === false); */
    router.events.on('routeChangeComplete', (e) => {
      setExpanded(false);
    });
    const sub = typeof path === 'string' && path.length > 1 ? path.substring(1).split('/').shift()! : '';
    const cls = ['header'];
    if (expanded) {
      cls.push('show-menu');
    }
    if (path.startsWith('/search')) {
      cls.push('hide-search-link');
      setSearch('');
    }
    if (search.length > 0 || searchFieldOn) {
      cls.push('search-mode');
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
  }, [site, router, expanded, context, search, updateSearchClassNames, searchFieldOn])

  return (
    <header className={classNames}>
      {isTagsMaze ? <a className='logo' onClick={(e) => handleTopLink(e)}></a> : <Link href='/tags'><a className='logo'></a></Link>} 
      <nav className='top-nav'>
        {hasMenuItems && <ul>
          {mainItems.map(item => {
            return <li key={item.path} className={ renderClassNames(item, subAlias)  }>
              <Link href={item.path}><a target={ renderTarget(item) }>{isHomeLink(item) ? <i className='icon icon-home' title={ item.title }></i> : item.title }</a></Link>
            </li>
          })}
          <li className={searchClassNames} onMouseEnter={() => setSearchFieldOn(true)} onMouseLeave={() => setSearchFieldOn(false)}>
            <Input name='search' value={search} onChange={updateSearch} className='search-field' size='sm' onKeyDown={e => (submitOnEnter(e))} id='nav-short-search-field' aria-labelledby={labels.search} rounded={false} shadow={false} animated={false} />
            <i className='icon icon-search' title='Search' onClick={submitSearch}></i>
          </li>
        </ul>}
      </nav>
      <div className='expand-nav icon-hamburger' onClick={() => toggleExpanded()}></div>
    </header>
  );
}

export default Header;