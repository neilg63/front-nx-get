import Link from 'next/link';
import { SimpleLink } from '../../lib/interfaces';
import labels from '../../lib/labels';
import { enableTimeline } from '../../lib/settings';

const navOptions: SimpleLink[] = [
  { 
    path: '/about/bio',
    title: 'Bio',
  },
  { 
    path: '/about/essays',
    title: 'Essays',
  },
  { 
    path: '/about/press',
    title: 'Press',
  },
  { 
    path: '/about/publications',
    title: 'Publications',
  },
];
if (enableTimeline) {
  navOptions.push(
    { 
      path: '/about/timeline',
      title: 'Timeline',
    }
  );
}

const AboutNav = ({ current }: { current: string }) => {
  const navLinks: SimpleLink[] = navOptions.map((link: SimpleLink, index: number) => {
    const selected = link.path === current;
    const activeClass = selected ? 'active' : 'inactive';
    const itemClass = link.path.substring(1).split('/').join('--');
    const className = [itemClass, activeClass].join(' ');
    const itemKey = ['about-nav', itemClass, index].join('-');
    return { ...link, selected, className, itemKey };
  })
  return (
    <nav className="about-nav">

      <h1 className='upper section-header'>{labels.about_title}</h1>
      { <ul className='row'>
        {navLinks.map((item: SimpleLink) =>
          <li key={item.itemKey} className={item.className}>
            <Link href={item.path}><a>{item.title}</a></Link>
          </li>)}
    </ul>}
    </nav>
  );
};

export default AboutNav;