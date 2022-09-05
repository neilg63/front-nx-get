import { StringMap } from "./interfaces";
import { keyToTitle } from "./utils";

const contentTypes: StringMap = {
  artwork: "Artworks",
  exhibition: "Exhibitions",
  news: "News",
  gttv: "GTTV",
  article: "Essays",
  press: "Press releases",
  press_article: "Press Articles",
  publication: "Publications",
};

const contenSections: StringMap = {
  artworks: "Artworks",
  exhibitions: "Exhibitions",
  news: "News",
  videos: "GTTV",
  articles: "Essays",
  press: "Press releases",
  essays: "Essays",
};

export const toBundlePlural = (bundle: string) => {
  const keys = Object.keys(contenSections);
  if (keys.includes(bundle)) {
    return contenSections[bundle];
  } else {
    return keyToTitle(bundle);
  }
};

export const bundleName = (bundle: string) => {
  switch (bundle) {
    case "article":
      return "Essay";
    case "gttv":
      return "GTTV";
    default:
      return keyToTitle(bundle);
  }
};

export const relatedItemsTitle = (bundle: string) => {
  const bName: string = Object.keys(contentTypes).includes(bundle)
    ? contentTypes[bundle]
    : keyToTitle(bundle);
  return `Related ${bName}`;
};

export default contentTypes;
