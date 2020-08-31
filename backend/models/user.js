const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* Création d'un schéma de données pour les "users" */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    email_mask: { type: String, required: true, unique: false },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);