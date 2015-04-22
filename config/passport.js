/**
 * Created by bogdanbegovic on 4/13/15.
 */

var LocalStrategy = require('passport-local').Strategy;
var logger = require('../util/logger');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var _ = require('underscore');

// expose this function to our app using module.exports
module.exports = function (passport) {
    'use strict';

    var Admin = require('../models/admin');
    var Professor = require('../models/professor');
    var Student = require('../models/student');

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        var tasks = [];

        tasks.push(Admin.findById(id).exec());
        tasks.push(Professor.findById(id).exec());
        tasks.push(Student.findById(id).exec());

        Q.all(tasks)
            .then(function (results) {
                return _.reduce(results, function (memo, res) {
                    if (res) {
                        memo = res;
                    }
                    return memo;
                }, undefined);
            },
            function (err) {
                return done(err);
            }
        ).then(
            function (data) {
                done(null, data);
            },
            function (err) {
                done(err, null);
            }
        );
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            var tasks = [];

            tasks.push(Admin.findOne({'email': email}).exec());
            tasks.push(Professor.findOne({'email': email}).exec());
            tasks.push(Student.findOne({'email': email}).exec());

            Q.all(tasks)
                .then(function (results) {
                    return _.reduce(results, function (memo, res) {
                        if (res) {
                            memo = res;
                        }
                        return memo;
                    }, undefined);
                },
                function (err) {
                    return done(err);
                }
            ).then(
                function(data){
                    var deferred = Q.defer();
                    if (!data) {
                        return done(null, false, 'There is no user with provided email');
                    } else if (!bcrypt.compareSync(password, data.password)) {
                        return done(null, false, 'Provided password is incorrect');
                    } else if (!data.isActive) {
                        return done(null, false, 'The user account has been deactivated');
                    } else {
                        data.logTime().then(
                            function(){
                                deferred.resolve(data);
                            },
                            function(err){
                                deferred.reject(err);
                            }
                        );
                        return deferred.promise;
                    }
                },
                function (err) {
                    return done(err);
                }
            ).then(function(data){
                    return done(null, data);
                });
        }
    ));

};