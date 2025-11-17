import Lenis from '@studio-freight/lenis';
import { shouldLoadHeavyFeatures } from './environment';

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (!shouldLoadHeavyFeatures()) {
    return null;
  }
  
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

