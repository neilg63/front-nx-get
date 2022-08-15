import Link from 'next/link';
import { TaxTerm } from '../../lib/entity-data';
import { notEmptyString } from '../../lib/utils';

const buildLink = (item: TaxTerm, base = '/', prefix = 'tags') => {
  const slugRef = notEmptyString(prefix) ? [prefix, item.slug].join('--') : item.slug;
  return [base, slugRef].join('/');
}

const TagList = ({ terms, base, prefix }: { terms: TaxTerm[], base: string, prefix: string }) => {
  const hasTerms = terms instanceof Array && terms.length > 0;
  return (
    <>
      { hasTerms && <ul className='terms row'>
        {terms.map((item: TaxTerm) =>
          <li key={item.key} className={item.slug}>
            <Link href={buildLink(item, base, prefix)}><a>{item.name}</a></Link>
          </li>)}
    </ul>}
    </>
  );
};

export default TagList;