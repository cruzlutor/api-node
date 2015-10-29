'use strict';

module.exports = {

    serialize: function(object, field){
        var _object = {};

        for(var i = 0; i < field.length; i++)
            _object[field[i]] = object[field[i]];

        return _object
    },

    toLower: function(v) {
        return v.toLowerCase();
    },
} 