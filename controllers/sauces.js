const Sauce = require("../models/Sauce");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config();

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
        likes: 0,
        dislikes: 0,
        usersLiked: [" "],
        usersdisLiked: [" "],
    });

    sauce
        .save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    if (req.file) {
        
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
            if (!verifyUser(req, sauce.userId)) {
                return res.status(403).json({ message: "Action non autorisée" });
            }
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                const sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                        }`,
                };
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...sauceObject, _id: req.params.id }
                )
                    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        });
    } else {
       
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
         
            if (!verifyUser(req, sauce.userId)) {
                return res.status(403).json({ message: "Action non autorisée" });
            }
            const sauceObject = { ...req.body };
            Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
            )
                .then(() =>
                    res.status(200).json({ message: "Sauce modifiée avec succès !" })
                )
                .catch((error) => res.status(400).json({ error }));
        });
    }
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error: error }));
};


function verifyUser(req, userId) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const tokenUserId = decodedToken.userId;
    if (userId == tokenUserId) {
        return true;
    } else {
        return false;
    }
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!verifyUser(req, sauce.userId)) {
                
                return res.status(403).json({ message: "Action non autorisée" });
            }
            const filename = sauce.imageUrl.split("/images/")[1]; 

            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(res.status(200).json({ message: "Sauce supprimée !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

