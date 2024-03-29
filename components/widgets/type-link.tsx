import Link from "next/link";
import { sanitize } from "../../lib/converters";
import { TaxTerm } from "../../lib/entity-data";
import { isObjectWith, notEmptyString } from "../../lib/utils";

const typePath = (type = '', basePath = '/') => {
  return [basePath.replace(/\/$/, ''), type].join('/');
}

const TypeLink = ({ value, basePath }: { value: any, basePath: string}) => {
  const isTerm = isObjectWith(value, 'name') || value instanceof TaxTerm;
  const isString = !isTerm && notEmptyString(value, 1);
  const name = isTerm ? value.name : isString ? value : '';
  const hasValue = notEmptyString(name);
  const slug = isTerm || isObjectWith(value, 'slug') ? value.slug : sanitize(name);
  return (
    <>
      { hasValue && 
        <Link href={typePath(slug, basePath)}><a>{name}</a></Link>
    }
    </>
  );
};

export default TypeLink;