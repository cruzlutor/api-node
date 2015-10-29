'use strict';

/**
 * Token auth method
 */

var passport    = require('passport'),
    strategies  = require('./../config/passport'),
    User        = require('./../models/user');


passport.use('token', new strategies.token.strategy(
    function(token, done) {
        User.findOne({'tokens.token': token}, function(err, user){
            if (err) return done(err);
            if (!user) return done(null, false, {message: 'Incorrect token.'});
            
            return done(null, user);
        })
    }
));

passport.use('local', new strategies.local.strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {

        User.findOne({email:email}, function(err, user){
            if (err) return done(err); 
            if(!user) return done(null, false, {message: 'Incorrect email.'});
            if(!user.validPassword(password)) return done(null, false, {message: 'Incorrect password.'});

            return done(null, user);
        });
    }
));