export interface CTConfigSet {
  [key: string]: string[];
}

export interface KeyStringValue {
  key: string;
  value: string;
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
