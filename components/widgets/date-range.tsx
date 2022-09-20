import Link from "next/link";
import { shortDate, mediumDate, longDate } from "../../lib/converters";
import { validDateString } from "../../lib/utils";

const DateRange = ({ item, format }: { item: any, format: string}) => {
  let hasStart = false;
  let hasEnd = false;
  let startDate = '';
  let endDate = '';
  let splitter = ' ';
  const separator = " - ";
  const formatFunc = format === 'long' ? longDate : format === 'short' ? shortDate : mediumDate;
  if (item instanceof Object) {
    const keys = Object.keys(item);
    const parts = [];
    if (keys.includes('value') && validDateString(item.value)) {
      startDate = formatFunc(item.value);
      hasStart = true;
      if (startDate.includes('.')) {
        splitter = '.';
      } else if (startDate.includes('/')) {
        splitter = '/';
      }
    }
    if (keys.includes('end_value') && validDateString(item.end_value)) {
      endDate = formatFunc(item.end_value);
      
      const startParts = startDate.split(splitter);
      const [d1, m1, y1] = startParts;
      const [d2, m2, y2] = endDate.split(splitter);
      if (y1 === y2) {
        startParts.pop();
        if (m1 === m2) {
          startParts.pop();
          if (d1 === d2) {
            startParts.pop();
          }
        }
      }
      if (startParts.length > 0) {
        startDate = startParts.join(' ');
        hasEnd = true;
      } else {
        startDate = endDate;
        endDate = '';
        hasEnd = false;
      }
    }
  }
  return (
    <>
      {hasStart && <span className="start-date">{startDate}</span>}
      { hasEnd &&  <><span className="separator">{separator}</span><span className="end-date">{ endDate }</span></>}
    </>
  );
};

DateRange.defaultProps = {
  format: 'medium'
};

export default DateRange;