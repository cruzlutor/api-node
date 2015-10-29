'use strict';

var mongoose    = require('mongoose'),
    validators  = require('./../config/validators'),
    Schema      = mongoose.Schema,
    bcrypt      = require('bcrypt-nodejs'),
    utils       = require('./../services/utils');

var userSchema = new Schema({
    email:          { type: String, required:true, set: utils.toLower, unique: true, validate: validators.isEmail },
    password:       { type: String, required:true },
    firstName:      { type: String, required:true },
    lastName:       { type: String },
    avatar:         { type: String },
    gender:         { type: String, enum: ['m','f']  },
    country:        { type: String, required:true },
    city:           { type: String, required:true },
    phone:          { type: String },
    about:          { type: String },

    /* user status */
    is_admin:       { type: Boolean, default:false },
    is_staff:       { type: Boolean, default:false },
    is_active:      { type: Boolean, default:false },

    /* tokens */
    tokens:         [{
        token:      { type: String },
        provider:   { type: String },
    }],

}, { versionKey: false} );

/* methods */
userSchema.methods.serialize = function(object) {
    var object = object || ['_id', 'is_provider', 'is_active', 'firstName', 'avatar'];
    return utils.serialize(this, object);
};

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);