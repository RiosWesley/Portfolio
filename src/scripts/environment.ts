export function isMobileDevice(): boolean {
  return window.innerWidth < 768 || 
         ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function shouldLoadHeavyFeatures(): boolean {
  return !isMobileDevice() && !prefersReducedMotion();
}

export function isPageVisible(): boolean {
  return !document.hidden;
}




