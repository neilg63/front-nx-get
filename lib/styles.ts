import { ContainerProps } from "@nextui-org/react";

// 2. Call `createTheme` and pass your custom values
export const customTheme = {
  type: "light", // it could be "light" or "dark"
  theme: {
    colors: {
      primary: "#ff6600",
      background: "#ffffff",
      text: "#333333",
      active: "#ff6600",
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

export const tooltipStyles = {
  borderRadius: 0,
  backgroundColor: "#ff6600",
  color: "white",
};

export function resizeGridItem(
  grid: HTMLElement,
  rowGap = 16,
  window: Window,
  item: HTMLElement
): number {
  let height = 300;
  if (grid instanceof HTMLElement) {
    const rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
    );
    const img = item.querySelector(".image-link");

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
  return height;
}

export function resizeAllGridItems(document: Document, window: Window) {
  const grid = document.querySelector(".grid-list .columns");
  if (grid instanceof HTMLElement) {
    const gap = window.getComputedStyle(grid).getPropertyValue("grid-row-gap");
    let height = 0;
    if (gap) {
      const rowGap = parseInt(gap);
      grid.style.gridAutoRows = "1rem";
      const items = grid.querySelectorAll("figure.node");
      if (items.length > 2) {
        const itemWidth = items[0].getBoundingClientRect().width;
        const gridWidth = grid.getBoundingClientRect().width;
        const numWide = Math.round(gridWidth / itemWidth);
        for (const item of items) {
          height += resizeGridItem(grid, rowGap, window, item as HTMLElement);
        }
        const minHeight = Math.ceil(height / numWide);
        grid.style.minHeight = `${minHeight}px`;
      }
    }
  }
}

export const defaultContainerStyles = { height: "auto" };

export const calcCarouselContainerStyles = (
  container: HTMLElement,
  index = 0,
  window: Window
) => {
  const figs = container.querySelectorAll(".media-items figure");
  if (figs.length > 0 && index < figs.length && index > 0) {
    const fig = figs[index];
    const img = fig.querySelector("img");
    if (img instanceof HTMLElement) {
      const height = img.getBoundingClientRect().height;
      container.style.maxHeight = `${height}px`;
      const pBotton = window
        .getComputedStyle(container)
        .getPropertyPriority("paddingBottom");
      const cHeight = height + pBotton;
      return {
        height: `${cHeight}px`,
      };
    }
  }
  return defaultContainerStyles;
};
