const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
	max: 10,  // limitation à 10 requête toutes les 15 min
})

module.exports = { limiter }
