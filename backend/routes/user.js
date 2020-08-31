const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const passwords = require('../middleware/passwords');
const rateLimiter = require('../middleware/rateLimiter');

/* Séparation de la logique métier des routes en contrôleurs */
router.post('/signup', passwords, userCtrl.signup);
router.post('/login', rateLimiter, userCtrl.login);

module.exports = router;