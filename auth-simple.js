/**
 *  Default Validator:
 */
var _defaultUsers = {};
module.exports = {
    maxUsers : 1000000,
    createUser : function(username, password, properties) {
        //validate input
        if(!(typeof username === 'string')) {
            throw "username must be a String";
        }
        if(!(typeof password === 'string')) {
            throw "password must be a String";
        }
        
        if(username in _defaultUsers) {
            throw "User ["+username+"] Allready Exists!"
        } else {
            user = {
                'username'   : username,
                'password'   : password,
                'properties' : properties
            };
            _defaultUsers[username] = user;
        }
    },
    validateUser : function(username, password) {
        //validate input
        if(!(typeof username === 'string')) {
            throw "username must be a String";
        }
        if(!(typeof password === 'string')) {
            throw "password must be a String";
        }
        
        try {
            return _defaultUsers[username].password === password;
        } catch (e) {
            return false;
        }
    },
    getUserProperties : function(username) {
        //validate input
        if(!(typeof username === 'string')) {
            throw "username must be a String";
        }
        
        try {
            var clone = Object.assign({}, _defaultUsers[username].properties); //create clone to avoid unwanted behavior of reassignment
            return clone;
        } catch (e) {
            throw "User: "+username+" doesn't exist!";
        }
    },
    setUserProperties : function(username, properties) {
        //validate input
        if(!(typeof username === 'string')) {
            throw "username must be a String";
        }
        
        try {
            var clone = Object.assign({}, properties); //create clone to avoid unwanted behavior of reassignment
            _defaultUsers[username].properties = clone;
        } catch (e) {
            throw "User: "+username+" doesn't exist!";
        }
    },
    deleteUser: function(username) {
        try {
            if(username in _defaultUsers) {
                delete _defaultUsers[username];
            } else {
                throw "user doesn't exist";
            }
        } catch(e) {
            throw "Couldn't delete User:"+username+" the user probably doesn't exist."
        }
    },
    clearUsers : function() {
        delete _defaultUsers;
        _defaultUsers = {}
    }
}