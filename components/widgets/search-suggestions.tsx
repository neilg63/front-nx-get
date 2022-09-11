import { useState, useEffect, useCallback } from "react";
import { getSearchResults } from '../../lib/api-view-results';
import { SearchItem } from '../../lib/interfaces';
import { fromLocal } from "../../lib/localstore";

const toSuggestionKey = (item: SearchItem, index: number): string => {
  const path = item.path.length > 1 ? item.path.substring(1) : '';
  return ['suggestion', path.split('-').join('--'), index].join('-')
}

const SearchSuggestions = ({ search, onSelect, focus }: { search: string, onSelect: Function, focus: boolean }) => {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaddng, setLoading] = useState(true);
  const hasItems = items instanceof Array && items.length > 0;
  const selectRow = (row: SearchItem) => {
    if (onSelect instanceof Function) {
      onSelect(row);
      setItems([]);
    }
  }
  const cls = ["search-suggestions"];
  if (focus) {
    cls.push('focus');
  }
  const wrapperClasses = cls.join(' ');
  useEffect(() => {
    let stored = fromLocal('current_search_string');
    const currentSearch = stored.valid ? stored.data : '';
    if (!loaddng && search !== currentSearch && search.length > 2) {
      setLoading(true);
      getSearchResults(search).then((results: SearchItem[]) => {
        if (results instanceof Array) {
          setItems(results);
        }
        setTimeout(() => {
          setLoading(false);
        }, 375);
      });

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    setTimeout(() => {
      if (items.length < 1) {
        setLoading(false);
      }
    }, 1000);
  }, [items, search, loaddng])
  return <>
      {hasItems && <ul className={wrapperClasses}>
      {items.map((item: SearchItem, index: number) => <li key={toSuggestionKey(item, index)} onClick={() => selectRow(item)}>{ item.title }</li>)}
      </ul>}
  </>
}


SearchSuggestions.defaultProps = {
  focus: false
};

export default SearchSuggestions;