import Link from "next/link";
import { toBundlePlural } from "../../lib/content-types";
import { isNumeric, keyToTitle, smartCastInt } from "../../lib/utils";

const BreadcrumbTitle = ({ path, title }: { path: string, title: string }) => {
  const alias = path.startsWith('/') ? path.substring(1) : path;
  const parts = alias.split('/');
  const first = parts.length > 0 ? parts[0] : "";
  const lastIndex = parts.length - 1;
  const links = parts.map((segment: string, index: number) => {
    const path = '/' + parts.slice(0, index + 1).join('/');
    let name = '';
    if (index === lastIndex) {
      name = title
    } else if (index < 1 && first !== 'about' || first === 'about' && index === 1) {
      name = toBundlePlural(segment);
    } else {
      name = keyToTitle(segment);
    }
    const itemKey = ['bc', parts.slice(0, index + 1).join('--'), index].join('-')
    const className = index < lastIndex ? 'breadcrumb' : 'current';
    return {
      path, name, itemKey, className
    }
  });
  return (
    <>
      {links.length > 0 && 
        links.map(item => <Link href={item.path} key={item.itemKey}><a className={item.className}>{item.name}</a></Link>)
    }
    </>
  );
};

export default BreadcrumbTitle;