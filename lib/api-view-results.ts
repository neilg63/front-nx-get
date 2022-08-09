import { NodeEntity } from "./entity-data";
import { paramsToQueryString } from "./utils";

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

export interface SimpleMenuItem {
  path: string;
  title: string;
  has_children: boolean;
  children?: SimpleMenuItem[];
}

export interface SiteInfoCore {
  name: string;
  slogan: string;
  [key: string]: string;
}

export interface SiteMenus {
  main: SimpleMenuItem[];
  footer: SimpleMenuItem[];
  [key: string]: SimpleMenuItem[];
}

export interface SiteInfo {
  info: SiteInfoCore;
  menus: SiteMenus;
  [key: string]: any;
}

const defaultSiteInfo = {
  info: {
    name: "",
    slogam: "",
  },
  menus: {
    main: [],
    footer: [],
  },
};

export const fetchApiViewResults = async (
  key: string,
  params: any = null
): Promise<NodeEntity[]> => {
  const uri =
    [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, "api", key].join("/") +
    paramsToQueryString(params);
  const res = await fetch(uri);
  const data = res.status >= 200 && res.status < 300 ? await res.json() : [];
  const results = data instanceof Array ? data : [];
  return results.map((row) => new NodeEntity(row));
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

export const fetchFullNode = async (path: string): Promise<NodeEntity> => {
  const key = path.replace(/^\//, "");
  const uri =
    [process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, "jsonuuid", "node-full"].join(
      "/"
    ) + paramsToQueryString({ alias: path });
  const res = await fetch(uri);
  const data = res.status >= 200 && res.status < 300 ? await res.json() : {};
  return new NodeEntity(data);
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
  const result = data instanceof Object ? data : defaultSiteInfo;
  return result;
};
