/*
  Miscellanous settings that are neither controlled by the CMS
  nor environmental (.env.local), but are best grouped in one place
*/

/*
 * Min. height at which longer continuous listings kick in
 */
export const minLargeSize = { width: 1024, height: 720 };

export const numScrollBatches = { standard: 5, large: 10 };

export const defaultDeviceSize = { width: 800, height: 600 };

export const isMinLargeSize = (contextRef: any = null) => {
  const context = contextRef instanceof Object ? contextRef : defaultDeviceSize;
  const screenHeight = context?.height || defaultDeviceSize.height;
  const screenWidth = context?.width || defaultDeviceSize.width;
  return screenHeight > minLargeSize.height && screenWidth > minLargeSize.width;
};

export const globalPagePaths = ["/", "/_app"];
