import { fetchApiViewResults } from "./api-view-results";
import { NodeEntity } from "./entity-data";
import { fromLocal, toLocal } from "./localstore";
import { isNumeric } from "./utils";

const isLifeYear = (yearRef: string): boolean => {
  if (isNumeric(yearRef) && yearRef.length === 4) {
    const y =
      typeof yearRef === "string"
        ? parseInt(yearRef, 10)
        : typeof yearRef === "number"
        ? yearRef
        : 0;
    return y > 1950;
  } else {
    return false;
  }
};

export const loadMore = async (path = "", page = 1): Promise<NodeEntity[]> => {
  try {
    const basePath = path.includes("?") ? path.split("?").shift()! : path;
    const parts = basePath.substring(1).split("/");
    let base = parts[0];
    const uriParts = [];
    if (parts.length > 1) {
      let second = parts[1];
      switch (base) {
        case "artworks":
          if (!isLifeYear(second)) {
            base = second.startsWith("tag--")
              ? "artworks-by-tag"
              : "artworks-by-type";
            second = second.includes("--")
              ? second.split("--").shift()!
              : second;
          }
          break;
      }
      uriParts.push(base);
      uriParts.push(second);
    } else {
      uriParts.push(base);
    }
    const uri = uriParts.join("/");
    const key = [uri, "items", page].join("--");
    const stored = fromLocal(key, 900);
    let items: any[] = [];
    if (stored.valid && !stored.expired) {
      if (stored.data instanceof Array && stored.data.length > 0) {
        items = stored.data;
      }
    }
    if (items.length < 1) {
      const data: any = await fetchApiViewResults(uri, { page });
      if (data instanceof Object && data.items instanceof Array) {
        items = data.items;
        toLocal(key, items);
      }
    }
    if (items instanceof Array && items.length > 0) {
      return items.map((n: any) => new NodeEntity(n));
    } else {
      return [];
    }
  } catch (e: any) {
    return [];
  }
};
