const imgPath = '.image-link';

const isAppleSafari = () => {
  const { userAgent } = window.navigator;
  
  if (typeof userAgent === 'string') {
    return /version\/\d.*?\bsafari\b/i.test(userAgent)
  } else {
    return false;
  }
}

/* export const justifyRows = (containerId: string, allowAnyway = false) => {
  const container = document.getElementById(containerId);
  const allowOverride = allowAnyway || !isAppleSafari();
  if (container instanceof HTMLElement && allowOverride) {
    const containerBR = container.getBoundingClientRect();
    const containerLeft = containerBR.left;
    const containerWidth = containerBR.width;
    const contRight = containerBR.right;
    let row = 0;
    let rowWidth = 0;
    let pdL = 0;
    container.querySelectorAll('figure').forEach((el, i) => {
      if (el instanceof HTMLElement) {
        const img = el.querySelector(imgPath);
        if (img instanceof HTMLElement) {
          const figBR = el.getBoundingClientRect();
          const currLeft = figBR.left - containerLeft;
          
          if (i > 0 && currLeft < 10) {
            const porWidth = containerWidth / rowWidth;
            if (porWidth > 0.95 && porWidth < 1.8) {
              const els = container.querySelectorAll(`.row-${row}`);
              const numEls = els.length;
              const lastIndex = numEls - 1;
              if (numEls > 1) {
                els.forEach((el, index) => {
                  if (el instanceof HTMLElement) {
                    if (el.classList.contains('resized') === false) {
                      const nh = el.clientHeight * porWidth;
                      el.style.height = `${nh}px`;
                      el.classList.add('resized')
                      if (index === lastIndex) {
                        const img = el.querySelector('img');
                        if (img instanceof HTMLElement) {
                          const rightEndDiff = (contRight - pdL - img.getBoundingClientRect().right - (pdL / 2)) / lastIndex;
                          for (let i = 1; i < numEls; i++) {
                            const innerEl = els[i].querySelector(imgPath);
                            if (innerEl instanceof HTMLElement) {
                              innerEl.style.marginLeft = `${rightEndDiff}px`;
                            }
                            const fcEl = els[i].querySelector('figcaption');
                            if (fcEl instanceof HTMLElement) {
                              fcEl.style.marginLeft = `${rightEndDiff}px`;
                            }
                          }
                        }
                      }
                    }
                  }
                });
                if (els.length > 2) {
                  if (els[0] instanceof HTMLElement && els[1] instanceof HTMLElement) {
                    if (els[0].style.height) {
                      const height1 = parseInt(els[0].style.height, 10);
                      const height2 = parseInt(els[1].style.height, 10);
                      const diff = Math.abs(height1 - height2);
                      if (diff < 24) {
                        els[0].style.height = els[1].style.height;
                      }
                    }
                  }
                }
              }
            }
            row++;
            rowWidth = 0;
          }
          if (el.classList.contains('has-row') === false) {
            el.classList.add(`row-${row}`, 'has-row');
          }
          if (pdL < 1) {
            pdL = parseInt(window.getComputedStyle(el).paddingRight, 10);
          }
          rowWidth = figBR.right - containerLeft + pdL;
        }
      }
    })
    if (container.classList.contains('resizing')) {
      container.classList.remove('resizing');
    }
  }
} */

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
              els.forEach((el, index) => {
                if (el instanceof HTMLElement) {
                  const rect = el.getBoundingClientRect();
                  elWidth += rect.width;
                  if (elHeight < 10) {
                    elHeight = rect.height;
                  }
                }
              });
              const porHeight = elHeight * (containerWidth/ elWidth);
              els.forEach((el) => {
                if (el instanceof HTMLElement) {
                  if (el.classList.contains('resized') === false) {
                    el.style.height = `${porHeight}px`;
                    el.classList.add('resized');
                  }
                }
              });
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


export const resetJustifiedRows = (containerId: string, justifyFunc: Function): void => {
    const container = document.getElementById(containerId);
    if (container instanceof HTMLElement) {
      container.classList.remove('width-fixed');
      if (container.classList.contains('resizing') === false) {
        container.classList.add('resizing');
        container.querySelectorAll('figure.resized').forEach((el) => {
          if (el instanceof HTMLElement) {
            for (let i = el.classList.length - 1; i >= 0; i--) {
              const cln = el.classList[i];
              if (cln.startsWith('row-') || ['resized', 'has-row'].includes(cln)) {
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