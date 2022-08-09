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

export const defaultImageLoader = ({ src }: { src: string }) => {
  return src;
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

export const paramsToQueryString = (params: any = null) => {
  const entries = params instanceof Object ? Object.entries(params) : [];
  if (entries.some((entry) => entry[0] === "m") === false) {
    entries.push(["m", "e"]);
  }
  return entries.length > 0
    ? "?" + entries.map(([key, value]) => key + "=" + smartCastString(value))
    : "";
};
