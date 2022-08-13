import { format } from "date-fns";

export const expandDate = (dtRef: string): string => {
  if (dtRef.length === 10 && dtRef.includes("-")) {
    return dtRef + "T12:00:00";
  } else {
    return dtRef;
  }
};

export const shortDate = (dtRef: string | Date): string => {
  const dt = typeof dtRef === "string" ? new Date(expandDate(dtRef)) : dtRef;
  return format(dt, "dd/MM/yyyy");
};

export const mediumDate = (dtRef: string | Date): string => {
  const dt = typeof dtRef === "string" ? new Date(expandDate(dtRef)) : dtRef;
  return format(dt, "d LLLL yyyy");
};
