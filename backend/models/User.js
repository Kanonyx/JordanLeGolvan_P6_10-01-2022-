const mongoose = require('mongoose');
//Verifie si le user existe dans la base de données
const uniqueValidator = require('mongoose-unique-validator');
//Fabrique un schema pour les utilisateurs dans la base de données.
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);