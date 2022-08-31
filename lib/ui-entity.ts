import { NodeEntity } from "./entity-data";
import { notEmptyString } from "./utils";

const imageStyles = ["max_650x650", "max_1300x1300", "max_2600x2600"];

const correctLocalPath = (path = "") => {
  if (path.startsWith("/") === false && path.startsWith("https://") === false) {
    return "/" + path;
  } else {
    return path;
  }
};

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
              this[key] = value;
              break;
            case "path":
              this[key] = correctLocalPath(value);
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

export const toImageSrcSet = (row: any = null) => {
  const imgs = toImageStyles(row);
  return imgs.map((img) => [img.uri, img.size].join(" ")).join(", ");
};

export const toImageSrc = (row: any = null) => {
  const imgs = toImageStyles(row);
  return imgs.length > 0 ? imgs[0].uri : "";
};

/* export const extractFromImageStyles = (
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
}; */

export const relatedKey = (row: NodeEntity, index: number): string => {
  return ["related", row.bundle, row.uuid, index].join("-");
};
