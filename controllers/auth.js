'use strict';

var mongoose    = require('mongoose'),
    passport    = require('passport'),
    jwt         = require('jsonwebtoken'),
    User        = require('./../models/user'),
    strategies  = require('./../config/passport'),
    utils       = require('./../services/utils');

function getToken(user, provider){
    for(var i=0; i< user.tokens.length; i++){
        if (user.tokens[i].provider == provider) return user.tokens[i].token;
    }
    return null;
}

function removeToken(user, provider){
    for(var i=0; i< user.tokens.length; i++){
        if (user.tokens[i].provider == provider){
            /* remove invalid token */
            user.tokens.splice(i, 1);
            /* save user to apply changes */
            user.save();
        }
    }
    return user;
}

function addToken(user, provider){ 
    var token = jwt.sign({id:user.id}, 'abc');

    /* remove old token */
    user = removeToken(user, provider);
    
    /* save the new token */
    user.tokens.push({token:token, provider:provider});
    user.save();

    return user;
} 

function verifyToken(user, provider, next){
    var token = getToken(user, provider);

    if (!token){ 
        user = addToken(user, provider);
        return next(user);
    }

    jwt.verify(token, 'abc', function(err, decode){
        if (err) user = addToken(user, provider);
        return next(user)
    });
}

exports.login = function(req, res){
    var found = false;
    var strategy = req.params.provider;

    Object.keys(strategies).forEach(function (key) {
        if (key == strategy) found = true;
    });

    if(found == false) 
        return res.status(404).json({});

    passport.authenticate(strategy, function(err, user) {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(400).json({});

        verifyToken(user, 'local', function(user){
            var data = {
                token: getToken(user, 'local'),
                user: user.serialize(),
            }
            
            return res.status(200).json(data);

        });
    })(req, res);
}

exports.signup = function(req, res){

    User.findOne({email:req.body.email}, function(err, user){
        if (err) return res.status(500).json(err);
        if (user) return res.status(400).json({meg:'El usuario ya existe'});

        var user = new User({
            email:      req.body.email,
            firstName:  req.body.firstName,
            lastName:   req.body.lastName,
            country:    req.body.country,
            city:       req.body.city,
        });

        user.password = user.generateHash(req.body.password);

        user.save(function(err, user){
            if (err) return res.status(500).json(err);
            user = user.serialize();
            return res.status(200).json(user);
        });
    })

}

exports.email = function(req, res){

    User.findById(req.user.id, function(err, user){
        if (err) return res.status(500).json(err);
        if (!user) return res.status(404).json({});

        user.email = req.body.email;

        user.save(function(err){
            if (err) return res.status(500).json(err);
            user = user.serialize();
            return res.status(200).json(user); 
        });

    });
}

exports.password = function(req, res){

    User.findById(req.user.id, function(err, user){
        if (err) return res.status(500).json(err);
        if (!user) return res.status(404).json({});
        if (!user.validPassword(req.body.currentPassword)) return res.status(400).json({message: 'Incorrect password'});
        
        user.password = user.generateHash(req.body.password);

        user.save(function(err){
            if (err) return res.status(500).json(err);
            user = user.serialize();
            return res.status(200).json(user); 
        });

    });
}