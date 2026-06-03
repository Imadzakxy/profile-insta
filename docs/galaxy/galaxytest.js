const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;
const DEG_TO_RAD = Math.PI / 180;

const config = {
    spiralArms: 10,
    pointsPerArm: 420,
    spiralTurns: 3,
    maxRadius: 800,
    rotationSpeed: 7, // degrés par seconde
    armSpacing: 35,
    armWidth: 0.7,
    randomness: 0.5,
    radialSpeed: 30,
    minRadius: 8
};

let stars = [];
let currentRotation = 0;
let lastTimestamp = 0;
let centerX = 0;
let centerY = 0;

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    centerX = width / 2;
    centerY = height / 2;
    config.maxRadius = Math.max(width, height) * 0.55;
    createStars();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStars() {
    stars = [];
    const { spiralArms, pointsPerArm, spiralTurns, armSpacing, armWidth } = config;

    for (let arm = 0; arm < spiralArms; arm++) {
        const baseAngle = arm * armSpacing * DEG_TO_RAD;

        for (let i = 0; i < pointsPerArm; i++) {
            const progress = i / pointsPerArm;
            const radius = progress * config.maxRadius * (1 + (Math.random() - 0.5) * 0.1);
            const angleOffset = (Math.random() - 0.5) * armWidth * progress * DEG_TO_RAD;
            const brightness = 100 + Math.random() * 120;

            stars.push({
                baseAngle,
                spiralAngle: progress * Math.PI * 2 * spiralTurns,
                progress,
                radius,
                angleOffset,
                brightness,
                size: 0.7 + (brightness / 255) * 2.3
            });
        }
    }
}
createStars();

function updateStars(deltaMs) {
    const deltaSec = deltaMs / 1000;
    currentRotation = (currentRotation + config.rotationSpeed * deltaSec) % 360;
    const radialStep = config.radialSpeed * deltaSec;

    for (const star of stars) {
        star.radius -= radialStep;

        if (star.radius <= config.minRadius) {
            star.radius = config.maxRadius * (0.9 + Math.random() * 0.1);
            star.angleOffset = (Math.random() - 0.5) * config.armWidth * star.progress * DEG_TO_RAD;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rotationRad = currentRotation * DEG_TO_RAD;

    for (const star of stars) {
        const angle = star.baseAngle + star.spiralAngle + rotationRad + star.angleOffset * config.randomness;
        const x = centerX + Math.cos(angle) * star.radius;
        const y = centerY + Math.sin(angle) * star.radius;
        const alpha = 0.28 + (star.brightness / 255) * 0.72;

        ctx.fillStyle = `rgba(${star.brightness}, ${star.brightness}, ${star.brightness}, ${alpha})`;
        if (star.size <= 1.8) {
            ctx.fillRect(x, y, 1.8, 1.8);
        } else {
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    updateStars(delta);
    draw();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
