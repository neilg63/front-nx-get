export const setEmtyFigureHeight = (document: Document) => {
  const container = document.querySelector(".flex-rows-6");
  if (container instanceof HTMLElement) {
    const figs = container.querySelectorAll("figure.node");
    if (figs.length > 0) {
      const lastIndex = figs.length - 1;
      const contRect = container.getBoundingClientRect();
      const lastFigRect = figs[lastIndex].getBoundingClientRect();
      const lastRowFigs = [...figs].filter(
        (f) => f.getBoundingClientRect().y === lastFigRect.y
      );
      const lastRowWidth = lastRowFigs
        .map((f) => f.getBoundingClientRect().width)
        .reduce((a, b) => a + b, 0);
      const remaining = contRect.width - lastRowWidth;
      const empFig = container.querySelector(".empty-figure");
      if (empFig instanceof HTMLElement && remaining > 10) {
        empFig.style.display = "block";
        empFig.style.width = `${remaining}px`;
      }
    }
  }
};

export const getScrollTop = () =>
  window.pageYOffset || document.documentElement.scrollTop;

const addRemoveBodyClass = (
  document: Document,
  clsName = "",
  remove = false
) => {
  const exists = document.body.classList.contains(clsName);
  if (!exists && remove === false) {
    document.body.classList.add(clsName);
  }
  if (exists && remove) {
    document.body.classList.remove(clsName);
  }
};

export const addBodyClass = (document: Document, clsName = "") => {
  addRemoveBodyClass(document, clsName, false);
};

export const removeBodyClass = (document: Document, clsName = "") => {
  addRemoveBodyClass(document, clsName, true);
};
