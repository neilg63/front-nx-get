import Link from "next/link";
import { SimpleMenuItem, SiteInfo } from "../../lib/entity-data";
import parse from "html-react-parser";
import ContactForm from '../widgets/contact-form';
import { Modal, useModal } from "@nextui-org/react";
import { notEmptyString } from "../../lib/utils";
import { useEffect, useState } from "react";
import PressInfo from "../widgets/press-info";
import MailchimpForm from "../widgets/mailchimp-form";

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
  const { setVisible, bindings } = useModal();
  const [contactOn, setContactOn] = useState(false);
  const [pressOn, setPressOn] = useState(false);
  const [mailingOn, setMailingOn] = useState(false);
  const [modalOverlayClasses, setModalOverlayClasses] = useState('contact-overlay');
  const siteObj = site instanceof Object ? site : { menus: {footer: [], social: []}, credits: '' };
  const { menus, credits } = siteObj;
  const hasMenus = menus instanceof Object;
  const menuItems = hasMenus && menus.footer instanceof Array ? menus.footer : [];
  const sociaItems = hasMenus && menus.social instanceof Array ? menus.social : [];
  
  const hasMenuItems = menuItems.length > 0;
  const siteInfo = new SiteInfo(site);

    const closeModal = () => {
    setVisible(false);
      setContactOn(false);
      setPressOn(false);
      setMailingOn(false);
  }

  const handleLink = (e: any) => {
    if (e instanceof Object) {
      const { target } = e;
      if (target && notEmptyString(target.href)) {
        const relPath = target.href.split('/').pop();
        e.preventDefault();
        switch (relPath) {
          case 'contact':
            setVisible(true);
            setPressOn(false);
            setMailingOn(false);
            setContactOn(true);
            break;
          case 'press':
            setVisible(true);
            setContactOn(false);
            setMailingOn(false);
            setPressOn(true);
            break;
          case 'subscribe':
            setVisible(true);
            setContactOn(false);
            setPressOn(false);
            setMailingOn(true);
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
                <a href={item.path} onClick={e => handleLink(e)}>{item.title}</a>
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
      {mailingOn && <MailchimpForm site={siteInfo} />}
      {pressOn && <PressInfo site={siteInfo} />}
     {bindings.open && <div className='control close-modal icon-prev-arrow-wide prev' onClick={e => closeModal()}></div>} 
    </Modal>
  </>  
  )
}

export default Footer;