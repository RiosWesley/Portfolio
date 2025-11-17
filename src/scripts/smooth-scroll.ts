import Lenis from '@studio-freight/lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis {
  lenis = new Lenis();
  
  function raf(time: number): void {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
  
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

