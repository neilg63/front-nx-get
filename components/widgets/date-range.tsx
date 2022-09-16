import Link from "next/link";
import { mediumDate } from "../../lib/converters";
import { validDateString } from "../../lib/utils";

const DateRange = ({ item }: { item: any }) => {
  let hasStart = false;
  let hasEnd = false;
  let startDate = '';
  let endDate = '';
  const separator = " - ";
  if (item instanceof Object) {
    const keys = Object.keys(item);
    const parts = [];
    if (keys.includes('value') && validDateString(item.value)) {
      startDate = mediumDate(item.value);
      hasStart = true;
    }
    if (keys.includes('end_value') && validDateString(item.end_value)) {
      endDate = mediumDate(item.end_value);
      const startParts = startDate.split(' ');
      const [d1, m1, y1] = startParts;
      const [d2, m2, y2] = endDate.split(' ');
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

export default DateRange;