import Link from "next/link";
import { isNumeric, smartCastInt } from "../../lib/utils";

const yearPath = (year = 0, basePath = '/') => {
  return [basePath.replace(/\/$/, ''), year].join('/');
}

const YearLink = ({ value, basePath }: { value: any, basePath: string}) => {
  const isNum = isNumeric(value);
  const year = isNum ? smartCastInt(value) : 0;
  const hasValue = year >= 1950;
  return (
    <>
      { hasValue && 
        <p className="year"><Link href={yearPath(year, basePath)}><a>{year}</a></Link></p>
    }
    </>
  );
};

export default YearLink;