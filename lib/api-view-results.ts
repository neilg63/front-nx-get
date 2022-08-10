import { NodeEntity, PageDataSet } from "./entity-data";
import { notEmptyString, paramsToQueryString } from "./utils";

export class BasicNodeInfo {
  uuid = "";
  nid = 0;
  title = "";
  alias = "";
  changed = 0;
  constructor(inData: any = null) {
    if (inData instanceof Object) {
      const { uuid, nid, title, alias, changed } = inData;
      if (uuid) {
        this.uuid = uuid.toString();
      }
      if (nid) {
        this.nid = nid;
      }
      if (title) {
        this.title = title.toString();
      }
      if (alias) {
        this.alias = alias.toString();
      }
      if (typeof changed === "number") {
        this.changed = changed;
      }
    }
  }

  get hasUuid() {
    return this.uuid.length > 16;
  }

  get age() {
    return new Date().getTime() / 1000 - this.changed;
  }

  get daysOld() {
    return this.age / (24 * 60 * 60);
  }
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
): Promise<PageDataSet> => {
  const queryParams: any = params instanceof Object ? params : {};
  if (queryParams.mode) {
    queryParams.mode = "next";
  }
  const uri =
    [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, "api", key].join("/") +
    paramsToQueryString(queryParams);
  const res = await fetch(uri);
  const data = res.status >= 200 && res.status < 300 ? await res.json() : {};
  return new PageDataSet(data);
};

export const fetchNodeInfoResults = async (
  path: string
): Promise<BasicNodeInfo[]> => {
  const key = path
    .replace(/^\//, "")
    .replace(/\/+/g, "--")
    .replace("artworks--", "artwork--");
  const uri = [
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
    "jsonuuid",
    "node",
    key,
  ].join("/");
  const res = await fetch(uri);
  const data = res.status >= 200 && res.status < 300 ? await res.json() : [];
  const results = data instanceof Array ? data : [];
  return results.map((item) => new BasicNodeInfo(item));
};

export const fetchFullNode = async (path: string): Promise<PageDataSet> => {
  const key = path.replace(/^\//, "");
  const uri =
    [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, "jsonuuid", "node-full"].join(
      "/"
    ) + paramsToQueryString({ alias: path });
  const res = await fetch(uri);
  const data = res.status >= 200 && res.status < 300 ? await res.json() : {};
  return new PageDataSet(data);
};

export const fetchNodeInfo = async (path: string): Promise<BasicNodeInfo> => {
  const results = await fetchNodeInfoResults(path);
  return results.length > 0 ? results[0] : new BasicNodeInfo();
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
