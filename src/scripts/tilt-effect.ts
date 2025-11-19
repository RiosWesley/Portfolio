
export function initTiltEffect() {
    const elements = document.querySelectorAll<HTMLElement>('[data-tilt]');

    elements.forEach((el) => {
        let rotateX = 0;
        let rotateY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let rafId: number | null = null;

        const update = () => {
            rotateX += (targetRotateX - rotateX) * 0.1;
            rotateY += (targetRotateY - rotateY) * 0.1;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            if (Math.abs(targetRotateX - rotateX) > 0.01 || Math.abs(targetRotateY - rotateY) > 0.01) {
                rafId = requestAnimationFrame(update);
            } else {
                rafId = null;
            }
        };

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            targetRotateX = -percentY * 10; // Max 10 deg tilt
            targetRotateY = percentX * 10;

            if (!rafId) {
                rafId = requestAnimationFrame(update);
            }
        });

        el.addEventListener('mouseleave', () => {
            targetRotateX = 0;
            targetRotateY = 0;
            if (!rafId) {
                rafId = requestAnimationFrame(update);
            }
        });
    });
}
