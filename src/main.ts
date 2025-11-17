import './styles/main.css';
import { initLoadingScreen } from './scripts/loading';
import { initSmoothScroll } from './scripts/smooth-scroll';
import { initNavigation } from './scripts/navigation';
import { initScrollReveal } from './scripts/scroll-reveal';
import { initBentoCards } from './scripts/bento-cards';
import { initFloatingHeader } from './scripts/floating-header';

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initSmoothScroll();
  initNavigation();
  initScrollReveal();
  initBentoCards();
  initFloatingHeader();
  
  const initThreeBackground = async () => {
    const { initThreeBackground: init } = await import('./scripts/three-background');
    init();
  };
  
  initThreeBackground();
});

