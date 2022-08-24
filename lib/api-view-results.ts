import { BaseEntity } from "./interfaces";
import {
  isObjectWithArray,
  isObjectWithObject,
  notEmptyString,
  paramsToQueryString,
} from "./utils";

export const fetchApiViewResults = async (
  key: string,
  params: any = null
): Promise<BaseEntity> => {
  const queryParams: any = params instanceof Object ? params : {};
  if (!queryParams.mode) {
    queryParams.mode = "next";
  }
  const queryStr = new URLSearchParams(queryParams).toString();
  const uri =
    [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, "api", key].join("/") +
    "?" +
    queryStr;
  const res = await fetch(uri, { method: "GET" });
  const data = res.status >= 200 && res.status < 300 ? await res.json() : {};
  const d = data instanceof Array ? data[0] : Object.keys(data);
  return data;
};

export const fetchFullNode = async (path: string): Promise<BaseEntity> => {
  const key = path.replace(/^\//, "");
  const uri =
    [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, "jsonuuid", "node-full"].join(
      "/"
    ) + paramsToQueryString({ alias: path });
  const res = await fetch(uri);
  const data = res.status >= 200 && res.status < 300 ? await res.json() : {};
  return data;
};

export const getSearchResults = async (
  q: string,
  bundles = [],
  bodyMode = 1,
  num = 25
): Promise<BaseEntity> => {
  if (notEmptyString(q)) {
    const ct = bundles.length > 0 ? bundles.join(",").toLowerCase() : "all";
    const uri =
      [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, "jsonuuid", "search"].join(
        "/"
      ) + paramsToQueryString({ q, b: bodyMode, n: num, ct });
    const res = await fetch(uri);
    const result =
      res.status >= 200 && res.status < 300 ? await res.json() : {};
    if (isObjectWithArray(result, "items")) {
      return result;
    }
  }
  return { valid: false, total: 0, num: 0, items: [] };
};

export const fetchSearchResultsPage = async (
  q: string,
  page = 0
): Promise<BaseEntity> => {
  if (notEmptyString(q)) {
    const uri =
      [
        process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
        "jsonuuid",
        "search-results",
      ].join("/") + paramsToQueryString({ q, page });
    const res = await fetch(uri);
    const result =
      res.status >= 200 && res.status < 300 ? await res.json() : {};
    if (isObjectWithObject(result, "containers")) {
      return result;
    }
  }
  return { valid: false, total: 0, num: 0, bundles: [], containers: [] };
};
