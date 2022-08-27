import Link from "next/link";
import { SimpleMenuItem, SiteInfo } from "../../lib/entity-data";
import parse from "html-react-parser";

const iconClassName = (uri = '') => {
  const cls = ['icon'];
  if (uri.includes('facebook')) {
    cls.push('icon-facebook');
  } else if (uri.includes('twitter')) {
    cls.push('icon-twitter');
  } else if (uri.includes('instagram')) {
    cls.push('icon-instagram');
  }
  return cls.join(' ');
}

const Footer = ({ site }: { site: SiteInfo }) => {
  const siteObj = site instanceof Object ? site : { menus: {footer: [], social: []}, credits: '' };
  const { menus, credits } = siteObj;
  const hasMenus = menus instanceof Object;
  const menuItems = hasMenus && menus.footer instanceof Array ? menus.footer : [];
  const sociaItems = hasMenus && menus.social instanceof Array ? menus.social : [];
  
  const hasMenuItems = menuItems.length > 0;
  return (
    <footer className='container footer'>
      <div className='menus row left-right'>
          <nav className='footer-nav'>
          {hasMenuItems && <ul className='menu footer-menu column left'>
            {menuItems.map((item: SimpleMenuItem) => {
              return <li key={item.path}>
                <Link href={item.path}><a>{item.title}</a></Link>
              </li>
            })}
          </ul>}
        </nav>
        <nav className='social-nav'>
          {hasMenuItems && <ul className='menu social-menu row right'>
            {sociaItems.map((item: SimpleMenuItem) => {
              return <li key={item.path}>
                <Link href={item.path}><a target='_blank' title={ item.title }><i className={ iconClassName(item.path) }></i><span className='text-label'>{item.title}</span></a></Link>
              </li>
            })}
          </ul>}
        </nav>
      </div>
      <div className='credits'>
        {parse(credits)}
      </div>
    </footer>
  )
}

export default Footer;