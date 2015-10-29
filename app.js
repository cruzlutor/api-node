'use strict';

var express        = require('express'),
    app            = express(),
    path           = require('path'),
    cors           = require('cors'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose'),
    passport       = require('passport');


/* connect mongo */
mongoose.connect('mongodb://localhost/aydoor', function(err, res){
    if (err) throw err;
    console.log('mongodb connected');
});


app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());


/* config passport */
require('./services/passport');


/* token middleware */
app.use(function (req, res, next) {
    passport.authenticate('token', {session: false}, function(err, user, info) {
        if(user) req.user = user;
        return next();
    })(req, res);
});


/* load routes */
app.use('/api', require('./routes/routes'));


/* run the server */
app.listen(3000, function(){
    console.log('server runing port 3000');
});