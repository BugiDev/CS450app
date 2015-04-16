/**
 * Created by bogdanbegovic on 4/16/15.
 */
/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function () {
    'use strict';

    var Professor = require('../models/professor');
    var generatePassword = require('password-generator');

    this.updateProfessor = function(professor){
        Professor.findOneAndUpdate({'_id': professor.id}, professor, {upsert:false}).lean().exec();
    };

    this.createProfessor = function(professor){
        Professor.findOne({ 'email': professor.email }, function (err, user) {
            if (err) {
                return err;
            }
            if (user) {
                err = 'User already exists';
                return err;
            }
            if(!professor.email || !professor.firstName || !professor.lastName){
                err = 'Validation error';
                return err;
            }else {

                var newUser = new Professor();
                var password = generatePassword(12, false, /\d/, 'met');
                newUser.email = professor.email;
                newUser.firstName = professor.firstName;
                newUser.lastName = professor.lastName;
                newUser.password = newUser.generateHash(password);

                newUser.save(function (err) {
                    if (err) {
                        console.error(err);
                        return err;
                    }
                    return newUser;
                });
            }
        });
    };

    this.getAllProfessors = function(){
        Professor.find({}).lean().exec();
    };

};