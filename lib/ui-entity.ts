import { notEmptyString } from "./utils";

const coreFields = [
  "id",
  "type",
  "langcode",
  "status",
  "title",
  "created",
  "changed",
  "promote",
  "sticky",
  "path",
  "body",
];

const coreFieldProps = [
  "id",
  "name",
  "value",
  "type",
  "end_value",
  "alias",
  "created",
];

const cleanFieldObj = (field: any = null, fieldKey = "") => {
  const entries: any[] = [];
  if (field instanceof Object) {
    Object.entries(field).forEach(([key, value]) => {
      if (coreFieldProps.includes(key) || key.startsWith("field_")) {
        entries.push([key, value]);
      }
    });
  }
  if (
    entries.some((entry) => entry[0] === "type" && entry[1] === "media--image")
  ) {
    //entries.push(['styles', toImageStyles(Object.fromEntries(entries), mediaItems)]);
    if (field.thumbnail instanceof Object) {
      const { resourceIdObjMeta } = field.thumbnail;
      if (resourceIdObjMeta) {
        const { alt, title, width, height } = resourceIdObjMeta;
        entries.push(["alt", alt]);
        entries.push(["title", title]);
        entries.push(["width", width]);
        entries.push(["height", height]);
      }
    }
  }
  return Object.fromEntries(entries);
};

const cleanField = (field: any = null, key = "") => {
  if (field instanceof Array) {
    return field.map((obj) => cleanFieldObj(obj, key));
  } else if (field instanceof Object) {
    return cleanFieldObj(field, key);
  } else {
    return field;
  }
};

const imageStyles = ["max_650x650", "max_1300x1300", "max_2600x2600"];

export class MetaDataSet {
  title = "";
  description = "";
  image = "";
  keywords?: string[] = [];
  path = "";

  constructor(inData: any = null) {
    if (inData instanceof Object) {
      Object.entries(inData).forEach(([key, value]: [string, any]) => {
        if (typeof value === "string") {
          switch (key) {
            case "title":
            case "description":
            case "image":
            case "path":
              this[key] = value;
              break;
          }
        } else if (value instanceof Array && key === "keywords") {
          this.keywords = value;
        }
      });
    }
  }
}

export interface ImageStyleAttrs {
  uri: string;
  size: string;
}

const toImageStyles = (attrs: any = null): ImageStyleAttrs[] => {
  let styles: ImageStyleAttrs[] = [];
  if (attrs instanceof Object) {
    if (attrs.field_media_image) {
      const file = attrs.field_media_image;
      if (file instanceof Object && file.image_style_uri instanceof Object) {
        styles = Object.entries(file.image_style_uri).map(([key, value]) => {
          const size = key.split("_").pop()?.split("x").shift() + "w";
          const uri = typeof value === "string" ? value : "";
          return {
            uri,
            size,
          };
        });
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

export const extractFromImageStyles = (
  styleMap: any = null,
  style = "max_650x650"
): string => {
  const keys = styleMap instanceof Object ? Object.keys(styleMap) : [];
  if (keys.includes(style)) {
    return styleMap[style];
  } else if (keys.length > 0) {
    return styleMap[keys[0]];
  }
  return "";
};
