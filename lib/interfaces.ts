export interface CTConfigSet {
  [key: string]: string[];
}

export interface KeyStringValue {
  key: string;
  value: string;
}

export interface SimpleLink {
  path: string;
  title: string;
  itemKey?: string;
  selected?: boolean;
  className?: string;
}

export interface SlugNameNum {
  num: number;
  slug: string;
  name: string;
}

export interface YearNum {
  num: number;
  year: number;
}

export interface Dims2D {
  width: number;
  height: number;
}

export interface BaseEntity {
  [key: string]: any;
}

export interface FilterOption {
  key: string;
  name: string;
  itemKey?: string;
  selected?: boolean;
  className?: string;
}

export interface StartEnd {
  start: number;
  end: number;
}

export interface ImgAttrs {
  src: string;
  srcSet: string;
  alt: string;
}

export interface StringMap {
  [key: string]: string;
}

export interface SearchItem {
  title: string;
  path: string;
  bundle?: string;
}
