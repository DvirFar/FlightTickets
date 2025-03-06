const delayRange = { min: 1000, max: 3000 }; // délai entre 1 et 3 secondes
const dropProbability = 0.3; // Probabilité de perte de message (30%)

// Simule un délai aléatoire
function simulateDelay(callback) {
    const delay = Math.floor(Math.random() * (delayRange.max - delayRange.min + 1)) + delayRange.min;
    setTimeout(callback, delay);
}

// Transmet un message au destinataire avec délai et possibilité de perte
function transmitMessage(message, destination) { }