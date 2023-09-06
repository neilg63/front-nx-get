import Link from "next/link";
import { toBundlePlural } from "../../lib/content-types";
import { keyToTitle, smartCastInt } from "../../lib/utils";

const BreadcrumbTitle = ({ path, title }: { path: string, title: string }) => {
  const alias = path.startsWith('/') ? path.substring(1) : path;
  const parts = alias.split('/');
  const first = parts.length > 0 ? parts[0] : "";
  const lastIndex = parts.length - 1;
  let boolKeys: string[] = [];
  const links = parts.map((segment: string, index: number) => {
    const path = '/' + parts.slice(0, index + 1).join('/');
    let name = '';
    if (index === lastIndex) {
      name = title
    } else if (index < 1 && first !== 'about' || first === 'about' && index === 1) {
      name = toBundlePlural(segment);
      if (name.includes('-by-')) {
        const parts = name.split('-by-');
        name = parts[0];
        if (parts.length > 1 && parts[1] === 'solo') {
          boolKeys = ['solo', 'group'];
        }
      }
    } else {
      name = keyToTitle(segment);
    }
    const isLast = lastIndex === index;
    if (index > 0 && boolKeys.length > 1 && /^[01]/.test(name)) {
      const bVal = smartCastInt(name) > 0;
      name = bVal ? boolKeys[0] : boolKeys[1];
    }
    const itemKey = ['bc', parts.slice(0, index + 1).join('--'), index].join('-');
    const className = isLast ? 'current' : 'breadcrumb';
    return {
      path, name, itemKey, className, isLast
    }
  });
  return (
    <>
      {links.length > 0 && 
        links.map(item => item.isLast ? <span key={item.itemKey} className={ item.className}>{item.name}</span> : <Link href={item.path} key={item.itemKey}><a className={item.className}>{item.name}</a></Link>)
    }
    </>
  );
};

export default BreadcrumbTitle;