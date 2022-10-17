import { format } from "date-fns";
import { validDateString } from "./utils";

export const expandDate = (dtRef: string): string => {
  if (dtRef.length === 10 && dtRef.includes("-")) {
    return dtRef + "T12:00:00";
  } else {
    return dtRef;
  }
};

export const customDate = (
  dtRef: string | Date,
  code = "dd/MM/yyyy"
): string => {
  const isString = typeof dtRef === "string";
  if ((isString && validDateString(dtRef)) || dtRef instanceof Date) {
    const dt = isString ? new Date(expandDate(dtRef)) : dtRef;
    return dt.getTime() >= 0 ? format(dt, code) : "";
  } else {
    return "";
  }
};

export const shortDate = (dtRef: string | Date): string => {
  return customDate(dtRef, "dd.MM.yyyy");
};

export const longYear = (dtRef: string | Date): string => {
  return customDate(dtRef, "yyyy");
};

export const mediumDate = (dtRef: string | Date): string => {
  return customDate(dtRef, "d LLL yy");
};

export const longDate = (dtRef: string | Date): string => {
  return customDate(dtRef, "d LLLL yyyy");
};

export const sanitize = (str: string, separator = "-") => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[éèë]/g, "e")
    .replace(/[ìíïî]/g, "i")
    .replace(/[òóõôöø]/g, "o")
    .replace(/[ùûúü]/g, "u")
    .replace(/[ŝśšṡ]/g, "s")
    .replace(/[ß]+/g, "ss")
    .replace(/[^a-z0-9]+/g, separator)
    .replace(/([a-z0-9])[^a-z0-9]+$/, "$1");
};

export const toAlias = (path: string): string => {
  let alias = path.length > 1 ? path.substring(1) : path;
  if (alias.length < 2) {
    alias = "home";
  }
  return alias;
};

export const toMimeType = (extension = "") => {
  switch (extension.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "mp4":
    case "m4v":
    case "mpeg4":
      return "video/mp4";
    case "mp3":
      return "audio/mpeg";
    case "webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
};
