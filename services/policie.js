'user strict';

var passport = require('passport');

module.exports = function(req, res, next) {
	return passport.authenticate('token', { session: false })(req, res, next);
};