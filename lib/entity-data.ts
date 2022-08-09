import {
  isArrayOfObjectsWith,
  isNumeric,
  isObjectWith,
  notEmptyString,
} from "./utils";

export interface CTConfigSet {
  [key: string]: string[];
}

const includeKeys = {
  article: ["field_media", "field_tags"],
  news: ["field_media", "field_tags"],
  exhibition: ["field_images", "field_tags"],
};

const coreNodeKeys = [
  "title",
  "status",
  "path",
  "body",
  "created",
  "uid",
  "metatag",
];

const extraNodeFields = {
  exhibition: [
    "field_date_range",
    "field_images",
    "field_tags",
    "field_subtitle",
  ],
  news: ["field_date", "field_media", "field_subtitle"],
  artwork: [
    "field_year",
    "field_material_text",
    "field_location",
    "field_provenance",
    "field_images",
    "field_tags",
    "field_dimensions",
  ],
};

export interface KeyStringValue {
  key: string;
  value: string;
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

const toImageSrcSetFromAttrs = (imgs: ImageStyleAttrs[]) => {
  return imgs.map((img) => [img.uri, img.size].join(" ")).join(", ");
};

const toImageSrcFromAttrs = (imgs: ImageStyleAttrs[]) => {
  return imgs.length > 0 ? imgs[0].uri : "";
};

export const toImageSrcSet = (row: any = null) => {
  const imgs = toImageStyles(row);
  return imgs.map((img) => [img.uri, img.size].join(" ")).join(", ");
};

export const toImageSrc = (row: any = null) => {
  const imgs = toImageStyles(row);
  return imgs.length > 0 ? imgs[0].uri : "";
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
      Object.entries(([key, value]: [string, any]) => {
        if (key === "sizes" && value instanceof Object) {
          this.sizes = new Map(Object.entries(value));
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
    return bestMatch;
  }

  get imageStyles(): ImageStyleAttrs[] {
    return this.hasSizes ? toImageStyles(this.sizes) : [];
  }

  get srcSet(): string {
    return this.imageStyles.length ? toImageSrcSet(this.imageStyles) : "";
  }
}

export class NodeEntity {
  nid = 0;
  uuid = "";
  status = 0;
  path = "";
  title = "";
  bundle = "";
  body = "";
  promote = false;
  sticky = false;
  field_images: MediaItem[] = [];
  field_media?: MediaItem;
  field_document?: MediaItem;
  field_tags: TaxTerm[] = [];
  [name: string]: any;

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      const strFields = ["path", "title", "body", "summary", "bundle", "uuid"];
      const boolFields = ["promote", "sticky"];
      const intFields = ["nid", "status"];
      const mediaFields = ["field_media", "field_document", "field_video"];
      const taxFields = ["field_type", "field_material"];
      const entityFields = [
        "field_related_content",
        "field_related_essays",
        "field_related_exhibitions",
        "field_related_press",
        "field_related_videos",
      ];
      Object.entries(([key, value]: [string, any]) => {
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
        } else if (isArrayOfObjectsWith(value, "uri")) {
          this.field_images = value.map((row: any) => new MediaItem(row));
        } else if (isObjectWith(value, "name") && taxFields.includes(key)) {
          this[key] = new TaxTerm(value);
        } else if (isObjectWith(value, "name") && taxFields.includes(key)) {
          this[key] = new TaxTerm(value);
        } else if (
          isArrayOfObjectsWith(value, "name") &&
          key === "field_tags"
        ) {
          this.fieldTags = value
            .map((row: any) => new TaxTerm(row))
            .filter((term: TaxTerm) => term.hasName);
        }
      });
    }
  }

  get firstImage() {
    if (isObjectWith(this.field_media, "uri")) {
      return this.field_media;
    } else if (isArrayOfObjectsWith(this.field_images, "uri")) {
      return this.field_images[0];
    }
  }

  get hasImages() {
    return (
      this.field_images instanceof Array &&
      this.field_images.filter((mi: MediaItem) => mi.isImage).length > 0
    );
  }
}
