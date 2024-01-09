import { singleColumnStartWidth } from "./settings";

const imgPath = '.image-link';

const isAppleSafari = () => {
  const { userAgent } = window.navigator;

  if (typeof userAgent === 'string') {
    return /version\/\d.*?\bsafari\b/i.test(userAgent)
  } else {
    return false;
  }
}

export const justifyRows = (containerId: string, allowAnyway = false) => {
  const container = document.getElementById(containerId);
  const allowOverride = allowAnyway || !isAppleSafari();
  if (container instanceof HTMLElement && allowOverride) {
    const containerBR = container.getBoundingClientRect();
    const containerLeft = containerBR.left;
    const containerWidth = containerBR.width;
    const contRight = containerBR.right;
    let row = 0;
    let pdL = 0;
    if (container instanceof HTMLElement) {
      if (container.classList.contains('width-fixed') == false) {
        container.style.width = `${containerWidth}px`;
        container.classList.add('width-fixed');
      }
    }
    container.querySelectorAll('figure').forEach((el, i) => {
      if (el instanceof HTMLElement) {
        const img = el.querySelector(imgPath);
        if (img instanceof HTMLElement) {
          const figBR = el.getBoundingClientRect();
          const currLeft = figBR.left - containerLeft;
          
          if (i > 0 && currLeft < 10) {
            const els = container.querySelectorAll(`.row-${row}`);
            const numEls = els.length;
            const lastIndex = numEls - 1;
            if (numEls > 0) {

              let elHeight = 0;
              let elWidth = 0;
              let elLeft = 0;
              els.forEach((el, index) => {
                if (el instanceof HTMLElement) {
                  const rect = el.getBoundingClientRect();
                  elWidth += rect.width;
                  if (elHeight < 10) {
                    elHeight = rect.height;
                    elLeft = rect.left - containerLeft;
                  }
                }
              });

              let multiple = containerWidth / elWidth;
              if (multiple > 1.333 && elLeft > 0) {
                elWidth += elLeft;
                multiple = containerWidth / elWidth;
              }
              // tweaks to prevent excessive height adjustments
              const multiplier = multiple >= 1.01 ?  multiple > 1.6667 ? Math.pow(multiple, 0.983) : multiple > 1.5 ? Math.pow(multiple, 0.99) : multiple * 0.993 : 1;
              const porHeight = multiplier > 2 ? elHeight * 2 : elHeight * multiplier;
              els.forEach((el) => {
                if (el instanceof HTMLElement) {
                  if (el.classList.contains('resized') === false) {
                    el.style.height = `${porHeight}px`;
                    el.classList.add('resized');
                  }
                }
              });
              const lr = container.querySelector(`.last-item`);
              if (lr instanceof HTMLElement) {
                const rect = lr.getBoundingClientRect();
                const leftPos = rect.left - containerLeft;
                if (leftPos < 50) {
                  if (lr.previousElementSibling instanceof HTMLElement) {
                    if (lr.previousElementSibling.classList.contains('resized')) {
                      lr.classList.add('new-row');
                    }
                  }
                }
              }
            }
            row++;
          }
          if (el.classList.contains('has-row') === false) {
            el.classList.add(`row-${row}`, 'has-row');
          }
          if (pdL < 1) {
            pdL = parseInt(window.getComputedStyle(el).paddingRight, 10);
          }
        }
      }
    })
    if (container.classList.contains('resizing')) {
      container.classList.remove('resizing');
    }
  }
}
export const resetJustifiedRows = (containerId: string, justifyFunc: any = null): void => {
    const container = document.getElementById(containerId);
    if (container instanceof HTMLElement) {
      container.classList.remove('width-fixed');
      container.removeAttribute('style');
      if (container.classList.contains('resizing') === false) {
        container.classList.add('resizing');
        container.querySelectorAll('figure.resized').forEach((el) => {
          if (el instanceof HTMLElement) {
            for (let i = el.classList.length - 1; i >= 0; i--) {
              const cln = el.classList[i];
              if (cln.startsWith('row-') || ['resized', 'has-row','row-end'].includes(cln)) {
                el.classList.remove(cln);
                el.removeAttribute("style");
                const innerEl = el.querySelector(imgPath);
                if (innerEl instanceof HTMLElement) {
                  innerEl.removeAttribute('style');
                }
                const fcEl = el.querySelector('figcaption');
                if (fcEl instanceof HTMLElement) {
                  fcEl.removeAttribute('style');
                }
              }
            }
          }
        })
        if (justifyFunc instanceof Function) {
          setTimeout(justifyFunc, 60);
        }
      }
    }
}

export const resetLastItem = (containerId = '') => {
  const container = document.getElementById(containerId);
  if (container instanceof HTMLElement) {
    const containerBR = container.getBoundingClientRect();
    const containerLeft = containerBR.left;
    const lr = container.querySelector(`.last-item`);
    if (lr instanceof HTMLElement) {
      const rect = lr.getBoundingClientRect();
      const leftPos = rect.left - containerLeft;
      if (leftPos < 50) {
        lr.classList.add('new-row');
      }
    }
  }
}



export const smartJustify = (containerId: string, window: Window) => {
  if (window && window.innerWidth > singleColumnStartWidth) {
    justifyRows(containerId, true);
  } else {
    resetJustifiedRows(containerId);
  }
}

export const smartResetJustified = (containerId: string, window: Window, normaliseGrid: Function) => {
  const funcRef = (window && window.innerWidth > singleColumnStartWidth) ? normaliseGrid : null;
  resetJustifiedRows(containerId, funcRef);
}
