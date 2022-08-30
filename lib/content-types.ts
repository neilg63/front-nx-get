import { capitalize } from "./utils";

const contentTypes = {
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
    default:
      return capitalize(bundle.replace(/_/g, " "));
  }
};

export default contentTypes;
