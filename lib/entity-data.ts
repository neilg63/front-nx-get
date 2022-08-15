import { SiteInfo, SiteInfoCore } from "./api-view-results";
import { MetaDataSet } from "./ui-entity";
import {
  isArrayOfObjectsWith,
  isNumeric,
  isObjectWith,
  notEmptyString,
  smartCastInt,
  toFullUri,
} from "./utils";

export interface CTConfigSet {
  [key: string]: string[];
}

export interface KeyStringValue {
  key: string;
  value: string;
}

export interface Dims2D {
  width: number;
  height: number;
}

export class TaxTerm {
  name = "";
  uuid = "";

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      const keys = Object.keys(inData);
      if (keys.includes("name")) {
        this.name = inData.name;
      }
      if (keys.includes("uuid")) {
        this.uuid = inData.uuid;
      }
    }
  }

  get hasName() {
    return notEmptyString(this.name);
  }

  toString(): string {
    return this.hasName ? this.name : "";
  }
}

export interface ImageStyleAttrs {
  uri: string;
  size: string;
}

const toImageStyles = (
  sizes: Map<string, string> = new Map()
): ImageStyleAttrs[] => {
  let styles: ImageStyleAttrs[] = [];
  if (sizes.size > 0) {
    for (const entry of sizes) {
      const [key, value] = entry;
      if (key.includes("x") && key.includes("_")) {
        const lastEl = key.split("_").pop();
        if (notEmptyString(lastEl)) {
          const width = lastEl?.split("x").shift();
          if (isNumeric(width)) {
            const size = width + "w";
            const uri = typeof value === "string" ? value : "";
            if (uri.length > 4) {
              styles.push({
                uri,
                size,
              });
            }
          }
        }
      }
    }
  }
  return styles;
};

export const imageSizeRef = (size: string): string => {
  switch (size) {
    case "preview":
      return "max_650x650";
    case "large":
      return "max_2600x2600";
    default:
      return "max_1300x1300";
  }
};

export const calcMaxSize = (size: string): Dims2D => {
  let width = 650;
  let height = 650;
  const segments = imageSizeRef(size).split("_");
  if (segments.length > 0) {
    const refStr = segments.pop();
    if (typeof refStr === "string" && refStr.includes("x")) {
      const [w, h] = refStr.split("x").map((s) => smartCastInt(s));
      if (w > 0 && h > 0) {
        width = w;
        height = h;
      }
    }
  }
  return { width, height };
};

export const toImageSrcSet = (row: any = null) => {
  const imgs = toImageStyles(row);
  return imgs.map((img) => [toFullUri(img.uri), img.size].join(" ")).join(", ");
};

export const toImageSrc = (row: any = null) => {
  const imgs = toImageStyles(row);
  console.log(imgs);
  return imgs.length > 0 ? toFullUri(imgs[0].uri) : "";
};

export class MediaItem {
  uri = "";
  filemime = "";
  sizes: Map<string, string> = new Map();
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  field_credit?: string;
  [name: string]: any;

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      Object.entries(inData).forEach(([key, value]: [string, any]) => {
        if (key === "sizes") {
          if (value instanceof Map) {
            this.sizes = value;
          } else if (value instanceof Object) {
            this.sizes = new Map(Object.entries(value));
          }
        } else if (
          ["height", "width"].includes(key) &&
          typeof value === "number"
        ) {
          this[key] = value;
        } else if (
          ["uri", "field_credit", "alt", "title", "filemime"].includes(key) &&
          typeof value === "string"
        ) {
          this[key] = value;
        } else {
          this[key] = value;
        }
      });
    }
  }

  get type() {
    const [first, second] = this.filemime.split("/");
    switch (first) {
      case "application":
        switch (second) {
          case "pdf":
            return "document";
          default:
            return first;
        }
      default:
        return first;
    }
  }

  get isImage() {
    return this.type === "image";
  }

  get hasSizes() {
    return this.sizes instanceof Map && this.sizes.size > 0;
  }

  size(key = ""): string {
    let bestMatch = "";
    if (this.hasSizes && this.sizes.has(key)) {
      const size = this.sizes.get(key);
      if (typeof size === "string") {
        bestMatch = size;
      }
    }
    if (bestMatch.length < 1) {
      bestMatch = this.uri;
    }
    return toFullUri(bestMatch);
  }

  get imageStyles(): ImageStyleAttrs[] {
    return this.hasSizes ? toImageStyles(this.sizes) : [];
  }

  get srcSet(): string {
    return this.imageStyles.length ? toImageSrcSet(this.imageStyles) : "";
  }

  calcTargetDims(size: string): Dims2D {
    const dims = calcMaxSize(size);
    let height = dims.height;
    let width = dims.width;
    if (this.width) {
      const ar = this.width! / this.height!;
      const hp = this.height! / dims.height;
      const wp = this.width! / dims.width!;
      height = wp > hp ? dims.height : dims.height / ar;
      width = wp > hp ? dims.width / ar : dims.width;
    }
    return { width, height };
  }

  calcHeight(size: string): number {
    return this.calcTargetDims(size).height;
  }

  calcWidth(size: string): number {
    return this.calcTargetDims(size).width;
  }

  get medium() {
    return this.size("max_1300x1300");
  }

  get preview() {
    return this.size("max_650x650");
  }

  dims(size: string) {
    const dims = calcMaxSize(size);
    return `${dims.width}x${dims.height}`;
  }
}

export class NodeEntity {
  nid = 0;
  tid = 0;
  uuid = "";
  status = 0;
  path = "";
  title = "";
  bundle = "";
  body = "";
  summary = "";
  promote = false;
  sticky = false;
  field_images: MediaItem[] = [];
  field_media: MediaItem = new MediaItem();
  field_document?: MediaItem;
  field_tags: TaxTerm[] = [];
  [name: string]: any;

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      const strFields = [
        "path",
        "title",
        "body",
        "summary",
        "bundle",
        "uuid",
        "name",
      ];
      const boolFields = ["promote", "sticky"];
      const intFields = ["nid", "tid", "status"];
      const mediaFields = ["field_media", "field_document", "field_video"];
      const taxFields = ["field_type", "field_material"];
      const entityFields = [
        "field_related_content",
        "field_related_essays",
        "field_related_exhibitions",
        "field_related_press",
        "field_related_videos",
      ];
      Object.entries(inData).map(([key, value]: [string, any]) => {
        const dataType = typeof value;
        if (dataType === "number") {
          if ([...strFields, ...boolFields].includes(key) === false) {
            this[key] = value;
          }
        } else if (dataType === "string") {
          if ([...intFields, ...boolFields].includes(key) === false) {
            this[key] = value;
          }
        } else if (dataType === "boolean") {
          if ([...strFields, ...intFields].includes(key) === false) {
            this[key] = value;
          }
        } else if (isObjectWith(value, "uri") && mediaFields.includes(key)) {
          this[key] = new MediaItem(value);
        } else if (isArrayOfObjectsWith(value, "uri") && value.length > 0) {
          this.field_images = value.map((row: any) => new MediaItem(row));
        } else if (isObjectWith(value, "name") && taxFields.includes(key)) {
          this[key] = new TaxTerm(value);
        } else if (entityFields.includes(key) && value instanceof Array) {
          this[key] = value.map((item: any) => new NodeEntity(item));
        } else if (
          isArrayOfObjectsWith(value, "name") &&
          key === "field_tags"
        ) {
          this.fieldTags = value
            .map((row: any) => new TaxTerm(row))
            .filter((term: TaxTerm) => term.hasName);
        } else {
          this[key] = value;
        }
      });
    }
  }

  get hasBody() {
    return notEmptyString(this.body, 2);
  }

  get hasSubtitle() {
    return notEmptyString(this.field_subtitle, 1);
  }

  get isTaxonomyTerm() {
    return this.nid < 1 && this.tid > 0;
  }

  get firstImage(): MediaItem {
    if (
      this.field_media instanceof MediaItem &&
      this.field_media.uri.length > 5
    ) {
      return this.field_media;
    } else if (
      this.field_images.length > 0 &&
      this.field_images[0] instanceof MediaItem &&
      this.field_images[0].uri.length > 5
    ) {
      return this.field_images[0];
    } else {
      return new MediaItem(null);
    }
  }

  get hasImage() {
    return (
      (this.field_media instanceof MediaItem && this.field_media.isImage) ||
      this.hasImages
    );
  }

  get hasImages() {
    return (
      this.field_images instanceof Array &&
      this.field_images.filter((mi: MediaItem) => mi.isImage).length > 0
    );
  }

  get images() {
    return this.hasImages ? this.field_images : [];
  }

  get tagList(): string {
    if (this.field_tags instanceof Array && this.field_tags.length > 0) {
      return this.field_tags.map((tm) => tm.name).join(", ");
    } else {
      return "";
    }
  }

  get key() {
    return notEmptyString(this.uuid)
      ? this.uuid
      : this.tid > 0
      ? ["tid", this.tid].join("-")
      : ["nid", this.nid].join("-");
  }
}

export class PageDataSet {
  entity: NodeEntity = new NodeEntity();
  items: NodeEntity[] = [];
  site: SiteInfo = new SiteInfo();
  meta: MetaDataSet = new MetaDataSet();
  page = 0;
  perPage = 0;
  total = 0;

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      const keys = Object.keys(inData);
      if (keys.includes("entity")) {
        this.entity = new NodeEntity(inData.entity);
      }
      if (keys.includes("items") && inData.items instanceof Array) {
        this.items = inData.items.map((item: any) => new NodeEntity(item));
      }
      if (keys.includes("site") && isObjectWith(inData.site, "info")) {
        this.site = new SiteInfo(inData.site);
      }
      if (keys.includes("meta") && isObjectWith(inData.meta, "title")) {
        this.meta = new MetaDataSet(inData.meta);
      }
      if (keys.includes("page") && typeof inData.page === "number") {
        this.page = inData.page;
      }
      if (keys.includes("perPage") && typeof inData.perPage === "number") {
        this.perPage = inData.perPage;
      }
      if (keys.includes("total") && typeof inData.total === "number") {
        this.total = inData.total;
      }
    }
  }
}
