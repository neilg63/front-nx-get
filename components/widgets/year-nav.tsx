import { YearNum } from "../../lib/interfaces";
import { subNavClassName } from "../../lib/utils";
import YearLink from "./year-link";


const YearNav = ({ years, current, basePath }: { years: YearNum[], current: string, basePath: string }) => {
  const basePathSlash = basePath + '/';
  return (
    <ul className='sub-nav years-nav row'>
      {years.map((item, index) => <li key={['year', item.year, index].join('-')} className={ subNavClassName(current, item.year)}>
        <YearLink value={ item.year } basePath={basePathSlash} />
      </li>)}
    </ul>
  );
}

YearNav.defaultProps = {
  basePath: '/artworks'
};

export default YearNav;