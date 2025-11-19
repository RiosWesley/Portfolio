import './styles/main.css';
import { initLoadingScreen } from './scripts/loading';
import { initSmoothScroll } from './scripts/smooth-scroll';
import { initNavigation } from './scripts/navigation';
import { initScrollReveal } from './scripts/scroll-reveal';
import { initBentoCards } from './scripts/bento-cards';
import { initFloatingHeader } from './scripts/floating-header';
import { shouldLoadHeavyFeatures, prefersReducedMotion } from './scripts/environment';

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();

  if (shouldLoadHeavyFeatures()) {
    initSmoothScroll();
  }

  initNavigation();
  initScrollReveal();
  initBentoCards();
  initFloatingHeader();

  import('./scripts/magnetic-element').then(({ initMagneticElements }) => {
    initMagneticElements();
  });

  import('./scripts/tilt-effect').then(({ initTiltEffect }) => {
    initTiltEffect();
  });

  // Initialize text scramble effect
  import('./scripts/text-scramble').then(({ initTextScramble }) => {
    initTextScramble();
  });

  if (!prefersReducedMotion()) {
    const initThreeBackground = async () => {
      const { initThreeBackground: init } = await import('./scripts/three-background');
      init();
    };

    initThreeBackground();
  } else {
    document.body.classList.add('no-webgl');
  }
});

