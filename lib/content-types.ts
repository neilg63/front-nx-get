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

export const bundleName = (bundle: string) => {
  switch (bundle) {
    case "aricle":
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
