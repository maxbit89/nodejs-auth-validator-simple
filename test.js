var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var authsimple = require("./auth-simple.js");
var performance = {now:require("performance-now")}; //mok for: https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
function meassureExePerf(method2test, args) {
    var t_start = performance.now();
    method2test.apply(this, args)
    var t_delta = performance.now() - t_start;
    return t_delta;
}

describe('createUser', function() {
    it('createUser Should create a user that could be validated.', function() {
        authsimple.clearUsers();
        authsimple.createUser("root", "e=m*c^2", {test:true});
        var ok = authsimple.validateUser("root", "e=m*c^2");
        assert(ok);
    });
    it('createUser username must be string.', function() {
        authsimple.clearUsers();
        var ok = false;
        try {
            authsimple.createUser(["test"], "e=m*c^2", {test:true});
        } catch (e) {
            expect(e).to.equal("username must be a String");
            ok = true;
        }
        assert(ok);
    });
    it('createUser password must be string.', function() {
        authsimple.clearUsers();
        var ok = false;
        try {
            authsimple.createUser("tst", ["e=m*c^2"], {test:true});
        } catch (e) {
            expect(e).to.equal("password must be a String");
            ok = true;
        }
        assert(ok);
    });
    it('createUser Should not create a user that already exists', function() {
        authsimple.clearUsers();
        var ok = false;
        authsimple.createUser("root", "e=m*c^2", {test:true});
        try {
            authsimple.createUser("root", "123", {test:true});
        } catch (e) {
            expect(e).to.equal("User [root] Allready Exists!")
            ok = true;
        }
        assert(ok);
    });
    it('createUser Performance', function() {
        this.timeout(300000);
        
        authsimple.clearUsers();
        var d;
        var g = meassureExePerf(function() {
            for(var i=1; i<=authsimple.maxUsers;i++) {
                d = meassureExePerf(authsimple.createUser, ["anotherUser"+i, "123456789012345678901234567890", {}]);
                expect(d).to.be.below(250);
                //console.log(d);
            }
        }, []);
        console.log("duration to create "+authsimple.maxUsers+" Accounts:"+g);
    });
});

describe('validateUser', function() {
    it('validate username and password non existing user', function() {
        authsimple.clearUsers();
        var ok = !authsimple.validateUser("nonexisting", "e=m*c^2");
        assert(ok);
    });
    it('validate user: username must be string.', function() {
        authsimple.clearUsers();
        var ok = false;
        try {
            authsimple.validateUser(["test"], "e=m*c^2");
        } catch (e) {
            expect(e).to.equal("username must be a String");
            ok = true;
        }
        assert(ok);
    });
    it('validate user: password must be string.', function() {
        authsimple.clearUsers();
        var ok = false;
        try {
            authsimple.validateUser("tst", ["e=m*c^2"]);
        } catch (e) {
            expect(e).to.equal("password must be a String");
            ok = true;
        }
        assert(ok);
    });
});

describe('get/setUserProperties', function() {
    it('Test Functionality of get/setUserProperties (get Predefined, set, get)', function() {
        var username = "User1";
        authsimple.clearUsers();
        
        authsimple.createUser(username, "123456789012345678901234567890", {'id':1});
        var props = authsimple.getUserProperties(username);
        expect(props.id).to.equal(1);
        props.id = 2;
        
        expect(authsimple.getUserProperties(username).id).to.equal(1); //properties can't be changed without the setter.
        
        authsimple.setUserProperties(username, props);
        expect(authsimple.getUserProperties(username).id).to.equal(2);
    });
    it('get/setUserProperties Performance', function() {
        this.timeout(300000);
        authsimple.clearUsers();
        for(var i=1; i<=authsimple.maxUsers;i++) {
            var username = "User"+i;
            authsimple.createUser(username, "123456789012345678901234567890", {'id':i});
            var d = meassureExePerf(authsimple.getUserProperties, [username]);
            expect(d).to.be.below(10);
        }
        expect(authsimple.getUserProperties("User1").id).to.equal(1);
    });
});

describe('deleteUser', function() {
    it('deleteUser Functional', function() {
        var username = "User1";
        authsimple.clearUsers();
        
        authsimple.createUser(username, "123456789012345678901234567890", {'id':1});
        authsimple.deleteUser(username);
        authsimple.createUser(username, "123456789012345678901234567890", {'id':1});
        authsimple.deleteUser(username);
    });
    it('deleteUser can not delete non existent user', function() {
        authsimple.clearUsers();
        var ok = false;
        try {
            authsimple.deleteUser("nonExistingUser");
        } catch(e) {
            expect(e).to.equal("Couldn't delete User:nonExistingUser the user probably doesn't exist.");
            ok = true;
        }
        assert(ok);
    });
    it('deleteUser Performance', function() {
        this.timeout(300000);
        authsimple.clearUsers();
        for(var i=1; i<=authsimple.maxUsers;i++) {
            var username = "User"+i;
            authsimple.createUser(username, "123456789012345678901234567890", {'id':i});
        }
        for(var i=1; i<=authsimple.maxUsers;i++) {
            var username = "User"+i;
            var d = meassureExePerf(authsimple.deleteUser, [username]);
            expect(d).to.be.below(1000);
        }
    });
});