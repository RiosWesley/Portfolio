export function initFloatingHeader(): void {
  const header = document.getElementById('floating-header');
  const heroSection = document.querySelector('section');
  
  if (!header || !heroSection) return;
  
  let heroHeight = heroSection.clientHeight;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > heroHeight * 0.8) {
      header.classList.add('is-visible');
    } else {
      header.classList.remove('is-visible');
    }
  });
  
  window.addEventListener('resize', () => {
    heroHeight = heroSection.clientHeight;
  });
}


