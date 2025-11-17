export function initBentoCards(): void {
  document.querySelectorAll<HTMLElement>('.bento-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const mouseEvent = e as MouseEvent;
      const rect = card.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-200px');
      card.style.setProperty('--mouse-y', '-200px');
    });
  });
}

