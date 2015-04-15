/**
 * Created by bogdanbegovic on 4/13/15.
 */

var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../models/admin');
var Professor = require('../models/professor');
var Student = require('../models/student');
var bcrypt = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = function (passport) {
    'use strict';

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        var dUser = null;

        var adminCheck = Admin.findById(user)
            .lean()
            .exec();

        var professorCheck = Professor.findById(user)
            .lean()
            .exec();

        var studentCheck = Student.findById(user)
            .lean()
            .exec();

        var check = adminCheck.
            then(function (user) {
                if(user){
                    dUser = user;
                }
            })
            .chain(professorCheck)
            .then(function (user) {
                if(user){
                    dUser = user;
                }
            })
            .chain(studentCheck)
            .then(function (user) {
                if(user){
                    dUser = user;
                }
            })
            .onResolve(function () {

                done(null, dUser);
            })
            .onReject(function (err) {
                console.error(err);
                done(err, dUser);
            });
    });

    passport.use('local-createNewAdmin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                Admin.findOne({ 'email': email }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        done(null, false, { message: 'postoji' });
                    } else {

                        var newUser = new Admin();
                        newUser.email = email;
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err) {
                                console.error(err);
                                return done(err, newUser);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-createNewProfessor', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                Professor.findOne({ 'email': email }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        done(null, false, { message: 'postoji' });
                    } else {

                        var newUser = new Professor();
                        newUser.email = email;
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err) {
                                console.error(err);
                                return done(err, newUser);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-createNewStudent', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                Student.findOne({ 'email': email }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        done(null, false, { message: 'postoji' });
                    } else {

                        var newUser = new Student();
                        newUser.email = email;
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.password = newUser.generateHash(password);
                        newUser.studentType = req.body.studentType;
                        newUser.generation = req.body.generation;

                        newUser.save(function (err) {
                            if (err) {
                                console.error(err);
                                return done(err, newUser);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            var lUser;

            var adminCheck = Admin.findOne({ 'email': email })
                .lean()
                .exec();

            var professorCheck = Professor.findOne({ 'email': email })
                .lean()
                .exec();

            var studentCheck = Student.findOne({ 'email': email })
                .lean()
                .exec();

            var check = adminCheck.
                then(function (user) {
                    if(user){
                        lUser = user;
                    }
                })
                .chain(professorCheck)
                .then(function (user) {
                    if(user){
                        lUser = user;
                    }
                })
                .chain(studentCheck)
                .then(function (user) {
                    if(user){
                        lUser = user;
                    }
                })
                .onResolve(function () {
                    if (!lUser) {
                        return done(null, false, {message: 'User not found'});
                    } else if (!bcrypt.compareSync(password, lUser.password)) {
                        return done(null, false, {message: 'Wrong password'});
                    } else {
                        return done(null, lUser);
                    }
                })
                .onReject(function (err) {
                    console.error(err);
                    return done(err);
                });
        }));

};