import { ContainerProps } from "@nextui-org/react";

// 2. Call `createTheme` and pass your custom values
export const customTheme = {
  type: "light", // it could be "light" or "dark"
  theme: {
    colors: {
      primary: "#ff6600",
    },
    space: {},
    fonts: {},
  },
};

export const containerProps: ContainerProps = {
  as: "main",
  display: "flex",
  direction: "column",
  justify: "center",
  alignItems: "center",
  gap: 0,
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  responsive: true,
  fluid: true,
  wrap: "wrap",
};

export const displayNone = { display: "none" };

export const remPx = 16;

export const timelineItemWidth = remPx * 20;

export const videoPreviewStyles = { aspectRatio: 16 / 9 };

export const tooltipStyles = { borderRadius: 0 };

export function resizeGridItem(
  grid: HTMLElement,
  rowGap = 16,
  window: Window,
  item: HTMLElement
) {
  if (grid instanceof HTMLElement) {
    const rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
    );
    const img = item.querySelector(".image-link");
    let height = 300;
    if (img instanceof HTMLElement) {
      height = img.getBoundingClientRect().height;
    }
    const fgc = item.querySelector("figcaption");
    if (fgc instanceof HTMLElement) {
      height += fgc.getBoundingClientRect().height;
    }
    const rowSpan = Math.ceil((height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
  }
}

export function resizeAllGridItems(document: Document, window: Window) {
  const grid = document.querySelector(".grid-list .columns");
  if (grid instanceof HTMLElement) {
    const gap = window.getComputedStyle(grid).getPropertyValue("grid-row-gap");
    if (gap) {
      const rowGap = parseInt(gap);
      grid.style.gridAutoRows = "1rem";
      const items = grid.querySelectorAll("figure.node");
      for (const item of items) {
        resizeGridItem(grid, rowGap, window, item as HTMLElement);
      }
    }
  }
}

/* export const setMaxFigureHeight = (container: HTMLElement) => {
  const fig = container.querySelector("figure.active");
  if (fig instanceof HTMLElement) {
    const img = fig.querySelector("img");
    if (img instanceof HTMLElement) {
      const height = img.getBoundingClientRect().height;
      fig.style.maxHeight = `${height}px`;
    }
  }
}; */
