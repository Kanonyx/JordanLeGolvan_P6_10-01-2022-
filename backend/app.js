require('dotenv').config()
//import des modules;
const express = require('express');

const app = express();

const mongoose = require('mongoose');

const stuffRoutes = require('./routes/stuff');

const path = require('path');

const userRoutes = require('./routes/user');
//connection à la base de données avec l'aide du module dotenv
mongoose.connect(process.env.MONGO_PSWD, 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));




app.use(express.json());

// Controle CORs
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Routes des sauces
app.use('/api/sauces', stuffRoutes);

app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;