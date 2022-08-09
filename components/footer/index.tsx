import Link from "next/link";
import { SimpleMenuItem } from "../../lib/api-view-results";
import styles from './styles.module.scss';

interface FooterLaboutProps { 
  menu: SimpleMenuItem[];
}

const Footer = ({menu}: FooterLaboutProps) => {
  return (
    <footer className='container'>
      <div className={styles.wrapper}>
        <nav>
          <ul>
            {menu.map(item => {
              return <li key={item.path}>
                <Link href={item.path}><a>{item.title}</a></Link>
              </li>
            })}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer;