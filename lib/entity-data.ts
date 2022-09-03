import contentTypes from "./content-types";
import { sanitize, shortDate, toMimeType } from "./converters";
import {
  Dims2D,
  KeyStringValue,
  SlugNameNum,
  StartEnd,
  YearNum,
} from "./interfaces";
import { MetaDataSet } from "./ui-entity";
import {
  isArrayOfObjectsWith,
  isNumeric,
  isObjectWith,
  notEmptyString,
  smartCastInt,
  toFullUri,
  validDateString,
} from "./utils";

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
  credits = "";
  [key: string]: any;

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      Object.entries(inData).forEach(([key, value]: [string, any]) => {
        if (key === "info" && value instanceof Object) {
          this.info = new SiteInfoCore(value);
        } else if (key === "menus" && value instanceof Object) {
          this.menus = new SiteMenus(value);
        } else if (key === "credits" && typeof value === "string") {
          this.credits = value;
        } else {
          this[key] = value;
        }
      });
    }
  }
}

export class TaxTerm {
  name = "";
  slug = "";
  uuid = "";

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      const keys = Object.keys(inData);
      if (keys.includes("name")) {
        this.name = inData.name;
      }
      if (keys.includes("slug")) {
        this.slug = inData.slug;
      }
      if (keys.includes("uuid")) {
        this.uuid = inData.uuid;
      }
      if (this.slug.length < 1) {
        this.slug = sanitize(this.name);
      }
    }
  }

  get hasName() {
    return notEmptyString(this.name);
  }

  get key() {
    return ["term", this.uuid, this.name].join("-");
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
      if (this.filemime.length < 1 && notEmptyString(this.uri)) {
        const extension = this.uri.split("?").pop()?.split(".").pop();
        if (extension) {
          this.filemime = toMimeType(extension);
        }
      }
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

  get isDocument() {
    return this.type === "document";
  }

  get hasSizes() {
    return this.sizes instanceof Map && this.sizes.size > 0;
  }

  get src() {
    return toFullUri(this.uri);
  }

  get altText() {
    return notEmptyString(this.alt) ? this.alt : "-";
  }

  get caption() {
    return notEmptyString(this.title) ? this.title : this.altText;
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

  get hasCredits() {
    return notEmptyString(this.field_credit);
  }

  get imageStyles(): ImageStyleAttrs[] {
    return this.hasSizes ? toImageStyles(this.sizes) : [];
  }

  get srcSet(): string {
    return this.imageStyles.length > 0 ? toImageSrcSet(this.sizes) : "";
  }

  calcTargetDims(size: string, round = false): Dims2D {
    const dims = calcMaxSize(size);
    let height = dims.height;
    let width = dims.width;
    if (this.width) {
      const ar = this.width! / this.height!;
      const wp = this.width! / dims.width!;
      const hp = this.height! / dims.height;
      height = wp < hp ? dims.height : dims.height / ar;
      width = wp < hp ? dims.width * ar : dims.width;
    }
    if (round) {
      return { width: Math.round(width), height: Math.round(height) };
    } else {
      return { width, height };
    }
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

  get large() {
    return this.size("max_2600x2600");
  }

  get preview() {
    return this.size("max_650x650");
  }

  dims(size: string) {
    const dims = this.calcTargetDims(size, true);
    return `${dims.width}x${dims.height}`;
  }
  calcAspectStyle() {
    const ar = this.width! / this.height!;
    return { aspectRatio: ar.toString() };
  }
}

export class NodeEntity {
  nid = 0;
  tid = 0;
  uuid = "";
  status = 0;
  num_media = 0;
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
  duplicate = false;
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
      const intFields = ["nid", "tid", "status", "num_media"];
      const mediaFields = ["field_media", "field_document", "field_video"];
      const taxFields = ["field_type", "field_material"];
      const entityFields = [
        "field_related_content",
        "field_related_essays",
        "field_related_exhibitions",
        "field_related_press",
        "field_related_videos",
        "related_artworks",
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
          this.field_tags = value
            .map((row: any) => new TaxTerm(row))
            .filter((term: TaxTerm) => term.hasName);
        } else {
          this[key] = value;
        }
      });
      if (notEmptyString(this.url) && this.path.length < 2) {
        this.path = this.url;
      }
      if (typeof this.body !== "string") {
        this.body = "";
      }
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

  indexedKey(index: number): string {
    return [this.bundle, this.uuid, index].join("-");
  }

  hasTextField(fn = "") {
    const kNames = [fn];
    if (fn.startsWith("field_") === false) {
      kNames.unshift(["field_", fn].join("_"));
    }
    const key = Object.keys(this).find((k) => kNames.includes(fn));
    if (key) {
      return notEmptyString(this[key]);
    } else {
      return false;
    }
  }

  get hasImage() {
    return (
      (this.field_media instanceof MediaItem && this.field_media.isImage) ||
      this.hasImages
    );
  }

  get hasDocument() {
    return (
      this.field_document instanceof MediaItem && this.field_document.isDocument
    );
  }

  get hasVideo() {
    return (
      this.field_video instanceof MediaItem &&
      notEmptyString(this.field_video.uri)
    );
  }

  get vimeoUrl() {
    if (this.hasVideo && this.field_video.uri.includes("vimeo.")) {
      const id = this.field_video.uri.replace(/^.*?\bvimeo\.[^\/]+?\//, "");
      return `https://player.vimeo.com/video/${id}`;
    }
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

  get shortDate() {
    if (validDateString(this.field_date)) {
      return shortDate(this.field_date);
    } else {
      return "";
    }
  }

  get numMedia() {
    return this.num_media > 0
      ? this.num_media
      : this.hasImages
      ? this.field_images.length
      : 0;
  }

  get numMediaLabel() {
    const num = this.numMedia;
    const pl = num > 1 ? "s" : "";
    return num > 0 ? `${num} media item${pl}` : "";
  }

  get typeYearLabel() {
    const parts: string[] = [];
    if (notEmptyString(this.field_type)) {
      parts.push(this.field_type);
    }
    if (this.field_year) {
      parts.push(this.field_year.toString());
    }
    return parts.join(" / ");
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

  get hasRelatedContent() {
    return (
      this.field_related_content instanceof Array &&
      this.field_related_content.length > 0
    );
  }

  get hasRelatedArtworks() {
    return (
      this.related_artworks instanceof Array && this.related_artworks.length > 0
    );
  }

  get hasRelatedExhibitions() {
    return (
      this.field_related_exhibitions instanceof Array &&
      this.field_related_exhibitions.length > 0
    );
  }

  get hasRelatedEssays() {
    return (
      this.field_related_essays instanceof Array &&
      this.field_related_essays.length > 0
    );
  }

  get hasRelatedPress() {
    return (
      this.field_related_press instanceof Array &&
      this.field_related_press.length > 0
    );
  }

  get hasRelatedVideos() {
    return (
      this.field_related_videos instanceof Array &&
      this.field_related_videos.length > 0
    );
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
  sets: Map<string, SlugNameNum[] | YearNum[]> = new Map();

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
      if (keys.includes("sets") && inData.sets instanceof Object) {
        Object.entries(inData.sets).forEach(([key, value]) => {
          if (value instanceof Array) {
            this.sets.set(key, value);
          }
        });
      }
    }
  }

  addItems(items: NodeEntity[] = [], removeDuplicates = false) {
    const currNids = this.items.map((row) => row.nid);
    const numNewItems = items.length;
    for (let i = 0; i < numNewItems; i++) {
      const item = items[i];
      item.duplicate = currNids.includes(item.nid);
      if (!item.duplicate || !removeDuplicates) {
        this.items.push(item);
      }
    }
  }

  get hasItems() {
    return this.items.length > 0;
  }

  get numPages() {
    return this.perPage > 0 && this.total > 0
      ? Math.ceil(this.total / this.perPage)
      : 1;
  }

  get loadedPages() {
    return Math.ceil(this.items.length / this.perPage);
  }

  get loadedPageIndex() {
    return this.loadedPages > 0 ? this.loadedPages - 1 : 0;
  }

  get nextPageOffset() {
    return this.page + this.loadedPages;
  }

  prevPageOffset(numPerBatch = 5) {
    const prevOffset = this.page - numPerBatch;
    return prevOffset > 0 ? prevOffset : 0;
  }

  get startEnd(): StartEnd {
    const start = this.page * this.perPage + 1;
    const endRefNum =
      start + Math.ceil(this.items.length / this.perPage) * this.perPage - 1;
    const end = endRefNum > this.total ? this.total : endRefNum;
    return { start, end };
  }

  get listingInfo() {
    const { start, end } = this.startEnd;
    return `${start} to ${end} of ${this.total}`;
  }

  get mayLoadMore() {
    const { end } = this.startEnd;
    return end < this.total;
  }

  get mayLoadPrevious() {
    return this.page > 0;
  }

  get showListingNav() {
    return this.mayLoadMore || this.mayLoadPrevious;
  }

  mayLoad(maxScrollPages = 5) {
    const offset = maxScrollPages < 6 ? -1 : 0;
    return (
      maxScrollPages > Math.ceil(this.items.length / this.perPage) - offset
    );
  }

  get showMore() {
    return this.numPages > 1 && this.items.length < this.total;
  }
}

export class SearchPageDataSet extends PageDataSet {
  containers: Map<string, NodeEntity[]> = new Map();
  bundles: string[] = [];

  constructor(inData: any = null) {
    super(inData);
    if (inData instanceof Object) {
      const { containers, bundles } = inData;
      if (bundles instanceof Array && bundles.length > 0) {
        this.bundles = bundles;
      }
      if (containers instanceof Object) {
        Object.entries(containers).forEach(([key, value]) => {
          if (value instanceof Array) {
            this.containers.set(
              key,
              value.map((item) => new NodeEntity(item))
            );
          }
        });
      }
    }
  }

  get bundleSet(): KeyStringValue[] {
    return Object.entries(contentTypes)
      .filter((entry) => this.bundles.includes(entry[0]))
      .map(([key, value]) => {
        return {
          key,
          value,
        };
      });
  }

  hasSections(key = "") {
    return this.containers.has(key);
  }

  results(key = ""): NodeEntity[] {
    const items = this.containers.has(key) ? this.containers.get(key) : [];
    return items instanceof Array ? items : [];
  }
}

export interface SimpleTerm {
  tid: number;
  title: string;
  bundle: string;
  path: string;
  num_related?: number;
  slug?: string;
}

export type WidgetItems = NodeEntity[] | MediaItem[] | SimpleTerm[];

export type WidgetContent = NodeEntity | MediaItem | WidgetItems;

export class PageWidget {
  type = "node";
  content: WidgetContent = new NodeEntity();
  constructor(type = "node", content: any = null) {
    this.type = type;
    if (content instanceof Object) {
      this.content = content;
    }
  }
}

export class CompoundPageDataSet extends PageDataSet {
  widgets: Map<string, PageWidget> = new Map();

  constructor(inData: any = null) {
    super(inData);
    if (inData instanceof Object) {
      const { widgets } = inData;
      if (widgets instanceof Object) {
        Object.entries(widgets).forEach(([key, value]: any[]) => {
          if (value instanceof Object) {
            const { type, content } = value;
            this.widgets.set(key, new PageWidget(type, content));
          }
        });
      }
    }
  }

  getWidgetTerms(key = ""): WidgetContent {
    if (this.widgets.has(key)) {
      const pw = this.widgets.get(key)!;
      if (pw.type === "terms") {
        if (pw.content instanceof Array) {
          return pw.content;
        }
      }
    }
    return [];
  }

  getMediaItems(key = ""): MediaItem[] {
    if (this.widgets.has(key)) {
      const pw = this.widgets.get(key)!;
      if (pw.type === "media") {
        if (pw.content instanceof Array) {
          return pw.content.map((item) => new MediaItem(item));
        }
      }
    }
    return [];
  }

  getEntity(key = ""): NodeEntity {
    if (this.widgets.has(key)) {
      const pw = this.widgets.get(key)!;
      if (pw.type === "node") {
        if (pw.content instanceof Object) {
          return new NodeEntity(pw.content);
        }
      }
    }
    return new NodeEntity();
  }

  getEntities(key = ""): NodeEntity[] {
    if (this.widgets.has(key)) {
      const pw = this.widgets.get(key)!;
      if (pw.type === "nodes") {
        if (pw.content instanceof Array) {
          return pw.content.map((item) => new NodeEntity(item));
        }
      }
    }
    return [];
  }
}
