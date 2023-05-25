const express = require('express')
const router = express.Router();
const {login, registro } = require('../Controllers/User') 



router.post('/login', login);
router.post('/registro', registro);

module.exports = router
