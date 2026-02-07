
export function createAshParticles() {
    const container = document.getElementById('bg-canvas');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('ash-particle');

        const x = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 5;
        const size = 2 + Math.random() * 3;

        particle.style.left = `${x}vw`;
        particle.style.top = `-10px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        container.appendChild(particle);
    }
}
