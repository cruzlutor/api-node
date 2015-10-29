'use strict';

var express     = require('express'),
    router      = express.Router();


/* import constrollers */
var authCtrl    = require('./../controllers/auth');


/* routes /api/auth */
router
	.post('/signup', authCtrl.signup)

	.put('/email', authCtrl.email)

	.put('/password', authCtrl.password)

	.post('/:provider', authCtrl.login);


module.exports = router;