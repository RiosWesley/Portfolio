
const chars = '!<>-_\\/[]{}—=+*^?#________';

class TextScramble {
    el: HTMLElement;
    originalText: string;
    queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>;
    frame: number;
    frameRequest: number;
    resolve: (value?: unknown) => void;

    constructor(el: HTMLElement) {
        this.el = el;
        this.originalText = el.innerText;
        this.queue = [];
        this.frame = 0;
        this.frameRequest = 0;
        this.resolve = () => { };
        this.update = this.update.bind(this);
    }

    setText(newText: string) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }
}

export function initTextScramble() {
    const elements = document.querySelectorAll('[data-scramble]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target as HTMLElement;
                if (!el.dataset.scrambled) {
                    const scrambler = new TextScramble(el);
                    // Start with random characters
                    const originalText = el.innerText;
                    el.dataset.scrambled = "true"; // Mark as processed

                    // Initial scramble (optional, can just start revealing)
                    scrambler.setText(originalText);
                    observer.unobserve(el);
                }
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => {
        // Optionally hide text initially or set to random chars immediately
        // For now, we'll let the scramble effect take over when visible
        observer.observe(el);
    });
}
