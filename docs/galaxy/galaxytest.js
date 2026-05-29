// Configuration galaxie réaliste
const config = {
    spiralArms: 10,               
    pointsPerArm: 200,           
    spiralTurns: 2.5,            
    maxRadius: 800,              
    rotationSpeed: 0.00001,         // degrés par seconde
    armSpacing: 60,
    armWidth: 0.4,

    // Ajouts : proportion d'aléatoire et vitesse radiale (px/s)
    randomness: 0.5,
    radialSpeed: 20,   // px par seconde vers le centre — réduire pour des étoiles plus lentes
    minRadius: 6        // rayon minimal pour considérer "arrivé au centre"
};

let currentRotation = 0;
let animationId;
let lastTimestamp = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// Cache DOM queries pour performance
let cachedPoints = [];
let centerX, centerY;

// Créer un point de la spirale avec distribution réaliste
function createSpiralPoint(armIndex, pointIndex, totalPointsPerArm) {
    const progress = pointIndex / totalPointsPerArm;
    
    // Distribution gaussienne pour densité réaliste (plus dense au centre des bras)
    const armOffset = (Math.random() - 0.5) * config.armWidth * progress * 100;
    
    // Calcul angle avec offset aléatoire
    const baseAngle = (armIndex * config.armSpacing * Math.PI) / 180;
    const spiralAngle = progress * Math.PI * 2 * config.spiralTurns;
    const angleOffset = (armOffset * Math.PI) / 180; // EN RADIANS
    // Rayon avec variation naturelle (stockée)
    const radiusVariation = 1 + (Math.random() - 0.5) * 0.1;
    const radius = progress * config.maxRadius * radiusVariation;
    
    const x = centerX + Math.cos(baseAngle + spiralAngle + angleOffset) * radius;
    const y = centerY + Math.sin(baseAngle + spiralAngle + angleOffset) * radius;
    
    // Luminosité variable selon distance et aléatoire.
    // Pour changer la couleur des étoiles, modifier ici la valeur 'brightness' et/ou remplacer
    // `rgb(${grayValue}, ${grayValue}, ${grayValue})` par une couleur RGB fixe ou un dégradé.
    let brightness;
    if (progress < 0.2) {
        // Noyau très brillant
        brightness = 180 + Math.random() * 75;
    } else if (progress < 0.5) {
        // Bras moyens
        brightness = 140 + Math.random() * 60;
    } else {
        // Extrémités plus sombres
        brightness = 100 + Math.random() * 50;
    }
    if (Math.random() > 0.97) {
        brightness = 220 + Math.random() * 35;
    }
    
    const grayValue = Math.floor(brightness);
    const opacity = 0.3 + (brightness / 255) * 0.7;
    const size = 1 + (brightness / 255) * 3;
    const glowSize = 4 + (brightness / 255) * 12;
    const glowOpacity = 0.2 + (brightness / 255) * 0.5;
    
    const point = document.createElement('div');
    point.className = 'spiral-point';
    
    // stocker valeurs aléatoires et indices pour l'animation (réutilisées dans update)
    point.dataset.angleOffset = angleOffset;
    point.dataset.radiusVariation = radiusVariation;
    point.dataset.armIndex = armIndex;
    point.dataset.pointIndex = pointIndex;
    point.dataset.progress = progress;
    point.dataset.currentRadius = radius; // <- stocke le rayon courant pour l'animation

    point.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: rgb(${grayValue}, ${grayValue}, ${grayValue});
        opacity: ${opacity};
        box-shadow: 
            0 0 ${glowSize}px rgba(${grayValue}, ${grayValue}, ${grayValue}, ${glowOpacity}),
            0 0 ${glowSize * 2}px rgba(${Math.max(0, grayValue - 20)}, ${Math.max(0, grayValue - 20)}, ${Math.max(0, grayValue - 20)}, ${glowOpacity * 0.6});
        animation-delay: ${(armIndex * 0.3 + progress * 2)}s;
    `;
    
    return point;
}

// Générer toutes les spirales et étoiles (optimisé avec DocumentFragment)
function generateGalaxy() {
    const galaxyContainer = document.getElementById('galaxyContainer');
    
    // Supprimer anciens éléments
    const existingElements = galaxyContainer.querySelectorAll('.spiral-point');
    existingElements.forEach(el => el.remove());
    
    // Utiliser DocumentFragment pour performance (1 seul reflow)
    const fragment = document.createDocumentFragment();
    centerX = window.innerWidth / 2;
    centerY = window.innerHeight / 2;
    
    // Générer spirales
    for (let arm = 0; arm < config.spiralArms; arm++) {
        for (let i = 0; i < config.pointsPerArm; i++) {
            const point = createSpiralPoint(arm, i, config.pointsPerArm);
            fragment.appendChild(point);
        }
    }
    
    galaxyContainer.appendChild(fragment);
    
    // Mettre en cache les points pour l'animation
    cachedPoints = Array.from(galaxyContainer.querySelectorAll('.spiral-point'));
}

// Mettre à jour positions (optimisé) -> maintenant reçoit delta (ms) pour mouvement radial
function updateSpiralPositions(deltaMs) {
    const rotationRad = (currentRotation * Math.PI) / 180;
    const rf = Math.max(0, Math.min(1, config.randomness || 0)); // sécurité 0..1
    const deltaSec = Math.max(0, (deltaMs || 16) / 1000);
    const radialStep = config.radialSpeed * deltaSec;

    for (let i = 0; i < cachedPoints.length; i++) {
        const point = cachedPoints[i];
        
        const armIndex = parseInt(point.dataset.armIndex, 10) || Math.floor(i / config.pointsPerArm);
        const pointIndex = parseInt(point.dataset.pointIndex, 10) || (i % config.pointsPerArm);
        const progress = parseFloat(point.dataset.progress) || (pointIndex / config.pointsPerArm);
        
        const baseAngle = (armIndex * config.armSpacing * Math.PI) / 180;
        const spiralAngle = progress * Math.PI * 2 * config.spiralTurns;
        
        let storedAngleOffset = parseFloat(point.dataset.angleOffset) || 0;
        const finalAngle = baseAngle + spiralAngle + rotationRad + storedAngleOffset * rf;
        
        let storedRadiusVar = parseFloat(point.dataset.radiusVariation) || 1;
        // lire/mettre à jour le rayon courant
        let currR = parseFloat(point.dataset.currentRadius);
        if (isNaN(currR)) {
            currR = progress * config.maxRadius * storedRadiusVar;
        }
        // avancer vers le centre
        currR -= radialStep;
        // si arrivé au centre, respawn au bord (on rérandomise légèrement)
        if (currR <= config.minRadius) {
            storedRadiusVar = 1 + (Math.random() - 0.5) * 0.08;
            storedAngleOffset = (Math.random() - 0.5) * config.armWidth * progress * 100 * Math.PI / 180;
            currR = config.maxRadius * (0.9 + Math.random() * 0.12); // respawn près du bord
            // sauvegarder nouvelles variations
            point.dataset.radiusVariation = storedRadiusVar;
            point.dataset.angleOffset = storedAngleOffset;
        }

        point.dataset.currentRadius = currR;
        
        const radius = currR * (1); // already includes variation
        const x = centerX + Math.cos(finalAngle) * radius;
        const y = centerY + Math.sin(finalAngle) * radius;
        
        point.style.left = x + 'px';
        point.style.top = y + 'px';
    }
}

// Animation fluide avec contrôle FPS
function animateSpirals(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    
    if (deltaTime >= frameInterval) {
        // rotation dépend du temps (degrés par seconde)
        currentRotation = (currentRotation + config.rotationSpeed * (deltaTime / 1000)) % 360;
        
        updateSpiralPositions(deltaTime);
        lastTimestamp = timestamp;
    }
    
    animationId = requestAnimationFrame(animateSpirals);
}

// Démarrer animation
function startAnimation() {
    if (animationId) cancelAnimationFrame(animationId);
    lastTimestamp = 0;
    animationId = requestAnimationFrame(animateSpirals);
}

// Arrêter animation
function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// Gérer visibilité page
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) lastTimestamp = 0;
});

// Glow qui suit la souris (optimisé avec variables CSS)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function updateMouseGlow(e) {
    mouseX = e.clientX || (e.touches && e.touches[0].clientX) || mouseX;
    mouseY = e.clientY || (e.touches && e.touches[0].clientY) || mouseY;
    
    // Mettre à jour les variables CSS
    const page = document.querySelector('.page');
    if (page) {
        page.style.setProperty('--mouse-x', mouseX + 'px');
        page.style.setProperty('--mouse-y', mouseY + 'px');
    }
}

// Événements souris (desktop)
document.addEventListener('mousemove', updateMouseGlow, { passive: true });

// Événements touch (mobile)
document.addEventListener('touchmove', updateMouseGlow, { passive: true });
document.addEventListener('touchstart', updateMouseGlow, { passive: true });

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    generateGalaxy();
    startAnimation();
});

// Redimensionnement fenêtre (debounce optimisé)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        generateGalaxy();
        lastTimestamp = 0;
    }, 250);
}, { passive: true });

// Nettoyage fermeture
window.addEventListener('beforeunload', () => {
    stopAnimation();
});
