const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const session = require('express-session');
const dotenv = require('dotenv').config()
const morgan = require('morgan');
const nocache = require('nocache');

/* Connexion à la base de donnée MongoDB */
mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Lancement du framework Express */
const app = express();

/* Middleware CORS - Ajout de headers à l'objet "response" */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/* Désinfecte les inputs contre les injections */
app.use(mongoSanitize());

/* Sécuriser Express en définissant divers en-têtes HTTP */
app.use(helmet());

/* Options de sécurisation des cookies */
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  cookie: { secure: true,
            httpOnly: true,
            domain: 'http://localhost:3000',
            expires: expiryDate
          }
  })
);

/* Morgan - crée un flux d'écriture (en mode ajout) */
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }); 
/* Morgan - configurer l'enregistreur */
app.use(morgan('combined', { stream: accessLogStream }));

/* Désactive la mise en cache du navigateur */
app.use(nocache());

/* Package body-parser - Extraire l'objet JSON de la demande */
app.use(bodyParser.json());

/* Rendre le dossier "images" statique */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Enregistrement des routes dans l'application */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;