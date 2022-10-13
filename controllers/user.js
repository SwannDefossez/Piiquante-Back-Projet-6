const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

const cryptoJs = require("crypto-js");


var schemaMDP = new passwordValidator();

schemaMDP
    .is().min(8)
    .is().max(20)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password1', 'Password2', 'Password3', 'Azerty1', 'Azerty2']);


exports.signup = (req, res, next) => {
    const emailCrypt = cryptoJs.HmacSHA256(req.body.email, `${process.env.CLE_EMAIL}`).toString();

    if (!emailValidator.validate(req.body.email)) {
        return res.status(400).json({ message: "Adresse email invalide !" })
    } else if (!schemaMDP.validate(req.body.password)) {
        return res.status(400).json({ message: "Mot de passe invalide !" })
    } else {

        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: emailCrypt,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }))
            })
            .catch(error => res.status(500).json({ error }))
    };
};


exports.login = (req, res, next) => {
    const emailCrypt = cryptoJs.HmacSHA256(req.body.email, `${process.env.CLE_EMAIL}`).toString();
    User.findOne({ email: emailCrypt })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                   
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};