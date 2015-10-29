'user strict';

/* strategies */
module.exports = {
    token: {
        strategy: require('passport-http-bearer').Strategy
    },
    local: {
        strategy: require('passport-local').Strategy
    },
}
