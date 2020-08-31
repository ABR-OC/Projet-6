/* Utilisé pour limiter les demandes répétées aux API publiques et / ou aux points de terminaison tels que la réinitialisation du mot de passe. */
const rateLimit = require('express-rate-limit'); 
module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: 'limite du taux de demandes dépassée!', 
});