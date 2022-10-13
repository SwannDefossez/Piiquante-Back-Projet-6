const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
 
   const header = req.header("Authorization")
 
   if (header == null) return res.status(403)
       .send({ message: "Invalid" })
 
   const token = header.split(" ")[1]
   

   jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
       
       if (err) return res.status(403)
           .send({ message: "Token invalid" + err })
       next()
   })
  
};