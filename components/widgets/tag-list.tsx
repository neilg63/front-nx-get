import Link from 'next/link';
import { TaxTerm } from '../../lib/entity-data';

const buildLink = (item: TaxTerm, base = '/') => {
  return [base, item.slug].join('/');
}

const TagList = ({ terms, base }: { terms: TaxTerm[], base: string }) => {
  const hasTerms = terms instanceof Array && terms.length > 0;
  return (
    <>
      { hasTerms && <ul className='terms row'>
        {terms.map((item: TaxTerm) =>
          <li key={item.key} className={item.slug}>
            <Link href={buildLink(item, base)}><a>{item.name}</a></Link>
          </li>)}
    </ul>}
    </>
  );
};

export default TagList;