import { format } from "date-fns";
import { validDateString } from "./utils";

export const expandDate = (dtRef: string): string => {
  if (dtRef.length === 10 && dtRef.includes("-")) {
    return dtRef + "T12:00:00";
  } else {
    return dtRef;
  }
};

export const shortDate = (dtRef: string | Date): string => {
  const dt = typeof dtRef === "string" ? new Date(expandDate(dtRef)) : dtRef;
  return format(dt, "dd MM yyyy");
};

export const mediumDate = (dtRef: string | Date): string => {
  const isString = typeof dtRef === "string";
  if ((isString && validDateString(dtRef)) || dtRef instanceof Date) {
    const dt = isString ? new Date(expandDate(dtRef)) : dtRef;
    return format(dt, "d LLLL yyyy");
  } else {
    return "";
  }
};

export const sanitize = (str: string, separator = "-") => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[éèë]+/g, "e")
    .replace(/[ìíïî]+/g, "i")
    .replace(/[òóõôöø]+/g, "o")
    .replace(/[ùûúü]+/g, "u")
    .replace(/[ŝśšṡ]+/g, "s")
    .replace(/[ß]+/g, "ss")
    .replace(/[^a-z0-9]+/g, separator)
    .replace(/([a-z0-9])[^a-z0-9]+$/, "$1");
};
