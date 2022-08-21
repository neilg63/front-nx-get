export interface CTConfigSet {
  [key: string]: string[];
}

export interface KeyStringValue {
  key: string;
  value: string;
}

export interface Dims2D {
  width: number;
  height: number;
}

export interface BaseEntity {
  [key: string]: any;
}
