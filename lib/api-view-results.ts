import { BaseEntity } from "./interfaces";
import { paramsToQueryString } from "./utils";

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
