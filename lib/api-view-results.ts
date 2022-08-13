import { NodeEntity, PageDataSet } from "./entity-data";
import { notEmptyString, paramsToQueryString } from "./utils";

export interface BaseEntity {
  [key: string]: any;
}

export class SimpleMenuItem {
  path = "";
  title = "";
  hasChildren = false;
  children: SimpleMenuItem[] = [];

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      const keys = Object.keys(inData);
      if (keys.includes("title") && notEmptyString(inData.path)) {
        this.path = inData.path;
      }
      if (notEmptyString(inData.title)) {
        this.title = inData.title;
      }
      if (keys.includes("has_children")) {
        this.hasChildren = inData.has_children;
      } else if (keys.includes("hasChildren")) {
        this.hasChildren = inData.hasChildren;
      }
      if (keys.includes("children") && inData.children instanceof Array) {
        this.children = inData.children.map(
          (item: any) => new SimpleMenuItem(item)
        );
      }
      this.hasChildren = this.children.length > 0;
    }
  }
}

export class SiteInfoCore {
  name = "";
  slogan = "";
  [key: string]: string;

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      if (notEmptyString(inData.name)) {
        this.name = inData.name;
      }
      if (notEmptyString(inData.slogan)) {
        this.slogan = inData.slogan;
      }
    }
  }
}

export class SiteMenus {
  main: SimpleMenuItem[] = [];
  footer: SimpleMenuItem[] = [];
  [key: string]: SimpleMenuItem[];

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      Object.entries(inData).forEach(([key, items]: [string, any]) => {
        if (items instanceof Array) {
          this[key] = items.map((item) => new SimpleMenuItem(item));
        }
      });
    }
  }
}

export class SiteInfo {
  info: SiteInfoCore = new SiteInfoCore();
  menus: SiteMenus = new SiteMenus();
  [key: string]: any;

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      Object.entries(inData).forEach(([key, value]: [string, any]) => {
        if (key === "info" && value instanceof Object) {
          this.info = new SiteInfoCore(value);
        } else if (key === "menus" && value instanceof Object) {
          this.menus = new SiteMenus(value);
        } else {
          this[key] = value;
        }
      });
    }
  }
}

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

export const getSiteInfo = async (): Promise<SiteInfo> => {
  const uri = [
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
    "jsonuuid",
    "site-info",
  ].join("/");
  const res = await fetch(uri);
  const data = res.status >= 200 && res.status < 300 ? await res.json() : [];
  const result = new SiteInfo(data);
  return result;
};
