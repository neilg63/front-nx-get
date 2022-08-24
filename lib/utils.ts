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
