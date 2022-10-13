const Sauce = require('../models/Sauce');
const dotenv = require("dotenv").config();

exports.likeUser = (req, res, next) => {

    /* format requete: 
    {
        "userId" : "63458c279c9740cb033eb5ac"
        "like" : +1
    }
    */


    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => {
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) { 
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }  
                    }
                )
                    .then(() => res.status(201).json({ message: "User like +1" }))
                    .catch((error) => res.status(400).json({ error }));
            };

            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId } 
                    }
                )
                    .then(() => res.status(201).json({ message: "User like 0" }))
                    .catch((error) => res.status(400).json({ error }));
            };

            if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
                Sauce.updateOne({_id : req.params.id},
                  {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.body.userId}
                  }
                  )
                  .then(() => res.status(201).json({message: "User disLike +1"}))
                  .catch((error) => res.status(400).json({error}));
              };
        
              // like = 0 pas de vote
              if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
                Sauce.updateOne({_id : req.params.id},
                  {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId}  
                  }
                  )
                  .then(() => res.status(201).json({message: "User disLike +1"}))
                  .catch((error) => res.status(400).json({error}));
              };







        }

        ).catch(
            (error) => {
                res.status(404).json({
                    error: error
                });
            }
        );






}