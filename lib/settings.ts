/*
  Miscellanous settings that are neither controlled by the CMS
  nor environmental (.env.local), but are best grouped in one place
*/
export const appVersion = 0.1;

export const basePath = "https://gtfront.platform-3.co.uk";
/*
 * Min. height at which longer continuous listings kick in
 */
export const minLargeSize = { width: 1024, height: 720 };

export const numScrollBatches = { standard: 5, large: 10 };

export const defaultDeviceSize = { width: 800, height: 600 };

export const singleColumnStartWidth = 675;

export const isMinLargeSize = (contextRef: any = null) => {
  const context = contextRef instanceof Object ? contextRef : defaultDeviceSize;
  const screenHeight = context?.height || defaultDeviceSize.height;
  const screenWidth = context?.width || defaultDeviceSize.width;
  return screenHeight > minLargeSize.height && screenWidth > minLargeSize.width;
};

export const globalPagePaths = ["/", "/_app"];

/* export const mailchimp = {
  apiKey: "ugewfhfweofhfh-europe",
  listId: "mailing",
}; */

export const artlogicMailing = {
  //uri: `https://app.artlogic.net/gavinturk/public/api/mailings/signup`,
  uri: "https://gtnew.platform-3.co.uk/jsonuuid/mailing",
  //apiKey: "ZmZlYjRkY2YwNTFjMTU0ODI0MTQwYzFlN2ExYmQ5OGQ=", // base64-encoded hash of reversed Api Key string
  apiKey: "",
};

export const googleTagId = 'G-XPYPL33YW1';

export const enableTimeline = false;