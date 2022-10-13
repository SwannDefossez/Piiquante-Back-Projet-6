const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauces.js');
const userRoutes = require('./routes/user');

const cors = require('cors');

const app = express();

const dotenv = require("dotenv").config();
const helmet = require("helmet"); // helmet sécurise les headers
app.use(helmet());


mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors())

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
});

app.use(express.json());


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, '/images')));


module.exports = app;