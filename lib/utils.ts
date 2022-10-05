import { FilterOption } from "./interfaces";

export const isString = (str: any = null) =>
  typeof str === "string" || str instanceof String;

export const notEmptyString = (str: any = null, min = 1) =>
  isString(str) && str.length >= min;

export const isObjectWith = (obj: any = null, field = "") => {
  return obj instanceof Object && Object.keys(obj).includes(field);
};

export const isObjectWithArray = (obj: any = null, field = "") => {
  return isObjectWith(obj, field) && obj[field] instanceof Array;
};

export const isObjectWithObject = (obj: any = null, field = "") => {
  return (
    isObjectWith(obj, field) &&
    obj[field] instanceof Object &&
    !(obj[field] instanceof Array)
  );
};

export const isArrayOfObjectsWith = (arr: any = null, field = "") => {
  if (arr instanceof Array) {
    return arr.every((row) => isObjectWith(row, field));
  } else {
    return false;
  }
};

const numPattern = `\s*-?\\d+(\\.\\d+)?`;

const intPattern = `\s*-?\\d+\s*$`;

const numRgx = new RegExp("^" + numPattern);

const intRgx = new RegExp("^" + intPattern);

export const isNumericType = (inval: any) =>
  typeof inval === "number" || inval instanceof Number;

export const isNumber = (inval: any) => isNumericType(inval) && !isNaN(inval);

export const isNumeric = (inval: any) => isNumber(inval) || numRgx.test(inval);

export const isInteger = (inval: any) =>
  isNumber(inval) ? inval % 1 === 0 : intRgx.test(inval);

export const stripHtml = (val: string) => {
  let str = "";
  if (typeof val === "string") {
    str = val.trim();
    if (/<\w+[^>]*?>/.test(str)) {
      str = str.replace(/<\/?\w+[^>]*?>/g, " ").replace(/\s\s+/g, " ");
    }
  }
  return str;
};

export const truncatePlain = (val: string, maxChars = 200) => {
  let str = stripHtml(val);
  const len = str.length;
  if (len > maxChars) {
    const targetLen = maxChars + 15;
    const cutOff = len > targetLen ? targetLen : len;
    const words = str.substring(0, cutOff).split(" ");
    if (words.length > 20) {
      words.pop();
    }
    str = words.join(" ") + " ...";
  }
  return str;
};

export const validDateString = (dt: any) => {
  return typeof dt === "string" && /^\d\d\d\d-\d\d-\d\d/.test(dt);
};

export const validEmail = (email: string) => {
  const rgx =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
  return email.length > 5 && rgx.test(email);
};

export const capitalize = (str: string): string => {
  if (notEmptyString(str)) {
    const trimmed = str.trim();
    if (trimmed.length > 1) {
      return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
    } else {
      return trimmed.toUpperCase();
    }
  } else {
    return "";
  }
};

export const keyToTitle = (str: string): string => {
  return capitalize(str.replace(/_/g, " "));
};

export const defaultImageLoader = ({
  src,
  width,
}: {
  src: string;
  width: number;
}) => {
  return src + `?w=${width}`;
};

const objectToString = (obj: any): string => {
  if (obj instanceof Array) {
    return obj.map((item) => smartCastString(obj)).join(",");
  } else if (obj instanceof Object) {
    return obj.toString();
  } else {
    return "";
  }
};

export const smartCastString = (input: any = null): string => {
  const dt = typeof input;
  switch (dt) {
    case "string":
      return input;
    case "number":
      return input.toString();
    case "boolean":
      return input ? "1" : "0";
    case "object":
      return objectToString(input);
    default:
      return "";
  }
};

export const smartCastNumber = (
  item: any,
  defVal = 0,
  isInt = false
): number => {
  let out = defVal;
  if (typeof item === "string") {
    if (item.length > 0) {
      if (/^\s*-?\d+(\.\d+)?\s*/.test(item)) {
        out = isInt ? parseInt(item, 10) : parseFloat(item);
      }
    }
  } else if (typeof item === "number") {
    out = item;
  }
  return out;
};

export const smartCastInt = (item: any, defVal = 0): number => {
  return smartCastNumber(item, defVal, true);
};

export const smartCastFloat = (item: any, defVal = 0): number => {
  return smartCastNumber(item, defVal, false);
};

export const paramsToQueryString = (params: any = null) => {
  const entries = params instanceof Object ? Object.entries(params) : [];
  return entries.length > 0
    ? "?" +
        entries
          .map(([key, value]) => key + "=" + smartCastString(value))
          .join("&")
    : "";
};

export const toFullUri = (uri: string): string => {
  if (uri.startsWith("/")) {
    return process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + uri;
  } else {
    return uri;
  }
};

export const extractQueryParamsFromContext = (context: any) => {
  const entries =
    context instanceof Object && context.query instanceof Object
      ? Object.entries(context.query)
      : [];
  return new Map(entries);
};

/*
Convert contextual query string page number of page index (0 => page 1)
*/
export const extractPageIndexFromContext = (context: any) => {
  const paramMap = extractQueryParamsFromContext(context);
  const pageRef = paramMap.has("page")
    ? smartCastInt(paramMap.get("page"), 10)
    : 1;
  return pageRef > 1 ? pageRef - 1 : 0;
};

export const buildConditionalClassNames = (
  baseClassName = "",
  trueClassName = "",
  isTrue = false
): string => {
  const cls = [baseClassName];
  if (isTrue) {
    cls.push(trueClassName);
  }
  return cls.join(" ");
};

export const subNavClassName = (
  current: string,
  refVal: string | number
): string => {
  const compStr = typeof refVal === "string" ? refVal : refVal.toString();
  return current === compStr ? "active" : "inactive";
};

export const extractYearUriFromParams = (
  first = "news",
  params: any = null
): string => {
  const yearRef = params instanceof Object ? params?.year : "";
  let y = 0;
  let second = "";
  if (
    typeof yearRef === "string" &&
    isNumeric(yearRef) &&
    yearRef.length === 4
  ) {
    y =
      typeof yearRef === "string"
        ? parseInt(yearRef, 10)
        : typeof yearRef === "number"
        ? yearRef
        : 0;
    if (y < 1960) {
      y = new Date().getFullYear();
    }
    second = y.toString();
  }
  return [first, second].join("/");
};

export const mapFilterOption = (
  row: FilterOption,
  ri: number,
  selectedKey = ""
): FilterOption => {
  const itemKey: string = ["filter-opt", row.key, ri].join("-");
  const selected = row.key === selectedKey;
  const className = selected ? "active" : "inactive";
  return { ...row, itemKey, selected, className };
};

export const filterNavClassName = (mode: string): string => {
  return ["filter-nav", ["show-by", mode].join("-")].join(" ");
};

export const matchFilterMode = (subPath = ""): string => {
  let fm = "all";
  if (notEmptyString(subPath)) {
    if (
      isNumeric(subPath) &&
      subPath.length === 4 &&
      parseInt(subPath, 10) > 1950 &&
      parseInt(subPath, 10) < 2100
    ) {
      fm = "year";
    } else {
      fm = subPath.startsWith("tag--") ? "tag" : "type";
    }
  }
  return fm;
};

export const reverseString = (s: string): string =>
  s.split("").reverse().join("");

export const fromBase64 = (s: string): string =>
  Buffer.from(s, "base64").toString("ascii");

export const fromReverseBase64 = (s: string): string =>
  reverseString(fromBase64(s));
