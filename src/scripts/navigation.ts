import { getLenis } from './smooth-scroll';

export function initNavigation(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.hash) {
        e.preventDefault();
        const targetElement = document.querySelector(link.hash) as HTMLElement | null;
        if (targetElement) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(targetElement);
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
      
      if (document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        if (mobileMenu) {
          mobileMenu.classList.remove('is-open');
        }
      }
    });
  });
  
  if (menuToggleBtn && mobileMenu) {
    menuToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
      mobileMenu.classList.toggle('is-open');
    });
  }
}

