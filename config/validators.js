'user strict';

var validate = require('mongoose-validator');

/* validator */
module.exports = {
    isEmail: [
        validate({
            validator: 'isEmail',
            message: 'Se esperaba un campo email',
            kind: 'Email validation'
        }),
    ]
};
