import Link from 'next/link';
import { PageDataSet } from '../../lib/entity-data';

const buildNavItems = (pageData: PageDataSet, maxLinks = 10) => {
  const { page, perPage, total, meta } = pageData;
  if (!maxLinks) {
    maxLinks = 10;
  }
  const numPages = Math.ceil(total / perPage);
  const showAll = numPages <= maxLinks
  const numLinks = showAll ? numPages : maxLinks - 1;
  const targetAdd = showAll ? 0 : page < maxLinks / 2 ? 0 : page - Math.floor(maxLinks / 2);
  const indexAdd = targetAdd > numPages - numLinks ? numPages - maxLinks + 1 : targetAdd;
  const basePath = '/' + meta.path;
  const arr = [...new Array(numLinks)];
  const items = arr.map((_, i) => {
    const n = i + 1;
    const num: number = n + indexAdd;
    const href = basePath + '?page=' + num;
    const active = page === num - 1;
    const classNames = [['page', num].join('-')];
    if (active) {
      classNames.push('active');
    }
    const key = [meta.path, 'page', num].join('-');
    const title = num.toString();
    return { 
      path: href,
      title,
      classNames: classNames.join(' '),
      key,
      active
    }
  });
  const lastNum = numLinks + indexAdd;
  console.log({lastNum})
  if (page > 0 && items.some(item => item.key.endsWith('-start')) === false){
    items.unshift({
      path: basePath + '?page=' + page,
      title: '⬅︎',
      classNames: "page-prev",
      active: false,
      key: [meta.path, 'page', 'prev'].join('-')
    })
    items.unshift({
      path: basePath + '?page=1',
      title: '⇐',
      classNames: "page-1",
      active: false,
      key: [meta.path, 'page', 'start'].join('-')
    })
  }
  if (lastNum < numPages && items.some(item => item.key.endsWith('-last')) === false) {
    items.push({
      path: basePath + '?page=' + (page + 2),
      title: '➡︎',
      classNames: "page-next",
      active: false,
      key: [meta.path, 'page', 'next'].join('-')
    })
    items.push({
      path: basePath + '?page=' + numPages,
      title: '⇒',
      classNames: "page-" + numPages,
      active: false,
      key: [meta.path, 'page', 'end'].join('-')
    })
  }
  return items;
}

const Paginator = ({pageData, maxLinks}: {pageData: PageDataSet, maxLinks: number}) => {
  const navItems = buildNavItems(pageData, maxLinks);
  return (
    <nav className='paginator'>
      <ul className='pages'>
      {navItems.map(item => {
        return <li key={item.key} className={item.classNames}>
          <Link href={item.path}><a>{item.title}</a></Link>
        </li>
      })}
      </ul>
    </nav>
  );
}

export default Paginator;