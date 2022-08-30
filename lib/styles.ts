import { ContainerProps } from "@nextui-org/react";

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
