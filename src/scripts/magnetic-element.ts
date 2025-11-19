
export function initMagneticElements() {
    const elements = document.querySelectorAll<HTMLElement>('[data-magnetic]');

    elements.forEach((el) => {
        let x = 0;
        let y = 0;
        let targetX = 0;
        let targetY = 0;
        let rafId: number | null = null;

        const update = () => {
            x += (targetX - x) * 0.1;
            y += (targetY - y) * 0.1;

            el.style.transform = `translate(${x}px, ${y}px)`;

            if (Math.abs(targetX - x) > 0.01 || Math.abs(targetY - y) > 0.01) {
                rafId = requestAnimationFrame(update);
            } else {
                rafId = null;
            }
        };

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            targetX = (e.clientX - rect.left - rect.width / 2) * 0.5;
            targetY = (e.clientY - rect.top - rect.height / 2) * 0.5;

            if (!rafId) {
                rafId = requestAnimationFrame(update);
            }
        });

        el.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) {
                rafId = requestAnimationFrame(update);
            }
        });
    });
}
