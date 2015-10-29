'use strict';

var express     = require('express'),
    router      = express.Router();


/* account */
router.use('/auth', require('./../routes/auth'));

module.exports = router;