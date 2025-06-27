import Link from "next/link";
import { CreditInfo, SimpleMenuItem, SiteInfo } from "../../lib/entity-data";
import parse from "html-react-parser";
import ContactForm from '../widgets/contact-form';
import { Modal, useModal } from "@nextui-org/react";
import { notEmptyString } from "../../lib/utils";
import { useEffect, useState} from "react";
import { useRouter } from "next/router";
import PressInfo from "../widgets/press-info";
import MailingForm from "../widgets/mailing-form";

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

function mapFooterItem(item: SimpleMenuItem) {
  item.hasOverride = /^\/(contact|press|subscribe)/i.test(item.path);
  return item;
}

const Footer = ({ site }: { site: SiteInfo }) => {
  const { setVisible, bindings } = useModal();
  const [contactOn, setContactOn] = useState(false);
  const [pressOn, setPressOn] = useState(false);
  const [mailingOn, setMailingOn] = useState(false);
  const [modalOverlayClasses, setModalOverlayClasses] = useState('contact-overlay');
  const siteObj = site instanceof Object ? site : { menus: {footer: [], social: []}, credits: new CreditInfo() };
  const { menus, credits } = siteObj;
  const hasMenus = menus instanceof Object;
  const menuItems = hasMenus && menus.footer instanceof Array ? menus.footer.map(mapFooterItem) : [];
  const sociaItems = hasMenus && menus.social instanceof Array ? menus.social : [];
  const privacyPath = '/info/privacy';
  const hasMenuItems = menuItems.length > 0;
  const siteInfo = new SiteInfo(site);

    const closeModal = () => {
    setVisible(false);
      setContactOn(false);
      setPressOn(false);
      setMailingOn(false);
  }

  const handleLink = (e: any, href: string) => {
    if (e instanceof Object) {
      if (notEmptyString(href)) {
        const relPath = href.split('/').pop();
        console.log('relPath', relPath);
        switch (relPath) {
          case 'contact':
           e.preventDefault();
            setVisible(true);
            setPressOn(false);
            setMailingOn(false);
            setContactOn(true);
            break;
          case 'press':

            e.preventDefault();
            setVisible(true);
            setContactOn(false);
            setMailingOn(false);
            setPressOn(true);
            break;
          case 'subscribe':
            e.preventDefault();
            setVisible(true);
            setContactOn(false);
            setPressOn(false);
            setMailingOn(true);
            break;
          default:
            // default action
            break;
        }
      }
    }
  }

  useEffect(() => {
    const cls = ['contact-overlay'];
    if (contactOn) {
      cls.push('with-contact-form');
    }
    setModalOverlayClasses(cls.join(' '));
  }, [contactOn, modalOverlayClasses])
  return (<>
    <footer className='container footer'>
      <div className='menus row left-right'>
          <nav className='footer-nav'>
          {hasMenuItems && <ul className='menu footer-menu column left'>
            {menuItems.map((item: SimpleMenuItem) => {
              return <li key={item.path}>
                {item.hasOverride ? <a href={item.path} onClick={e => handleLink(e, item.path)}>{item.title}</a> : <Link href={item.path}><a>{item.title}</a></Link>}
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
      <div className='credits-container'>
        <p className='credits-info'>
          <span className='copyright'>{credits.copyright}</span>
          <Link href={privacyPath}><a>{credits.privacy}</a></Link>
        </p>
        {parse(credits.designed)}
      </div>
      
    </footer>
    <Modal
      scroll={ false }
        width="100%"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      fullScreen={false}
      {...bindings}
      className={modalOverlayClasses}
    >
      {contactOn && <ContactForm site={siteInfo} />}
      {mailingOn && <MailingForm site={siteInfo} />}
      {pressOn && <PressInfo site={siteInfo} />}
      {bindings.open && <div className='control bottom-left close-modal icon-prev-arrow-wide' onClick={e => closeModal()}></div>} 
      {bindings.open && <div className='control top-right close-modal icon-close' onClick={e => closeModal()}></div>} 
    </Modal>
  </>  
  )
}

export default Footer;