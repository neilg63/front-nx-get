import Link from 'next/link';
import { PageDataSet } from '../../lib/entity-data';

const Paginator = ({pageData, maxLinks}: {pageData: PageDataSet, maxLinks: number}) => {
  const { page, perPage, total, meta } = pageData;
  if (!maxLinks) {
    maxLinks = 10;
  }
  const numPages = Math.ceil(total / perPage);
  const showAll = numPages <= maxLinks
  const numLinks = showAll ? numPages : maxLinks;
  const basePath = '/' + meta.path;
  const navItems = [...new Array(numPages)].map((_, i) => {
    const num: number = i + 1;
    const href = basePath + '?page=' + num;
    const active = page === i;
    const classNames = [['page', num].join('-')];
    if (active) {
      classNames.push('active');
    }
    const key = [meta.path, 'page', num].join('-');
    
    return { 
      path: href,
      title: num.toString(),
      classNames: classNames.join(' '),
      key,
      active
    }
  });
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