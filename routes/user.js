const express = require('express');
const router = express.Router();
const rate = require('../middleware/ratelimiter');
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', rate.limiter, userCtrl.login);

module.exports = router;