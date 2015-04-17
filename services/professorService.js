/**
 * Created by bogdanbegovic on 4/16/15.
 */

var Professor = require('../models/professor');
var generatePassword = require('password-generator');
var mailService = require('../services/mailService');

module.exports = {

    updateProfessor: function (professor) {
        'use strict';
        Professor.findOneAndUpdate({'_id': professor.id}, professor, {upsert: false}).lean().exec();
    },
    createProfessor: function (professor) {
        'use strict';
        Professor.findOne({'email': professor.email}, function (err, user) {
            if (err) {
                return err;
            }
            if (user) {
                err = 'User already exists';
                return err;
            }
            if (!professor.email || !professor.firstName || !professor.lastName) {
                err = 'Validation error';
                return err;
            } else {

                var newUser = new Professor();
                var password = generatePassword(12, false, /\d/, 'met');
                newUser.email = professor.email;
                newUser.firstName = professor.firstName;
                newUser.lastName = professor.lastName;
                newUser.password = newUser.generateHash(password);
                newUser.picture = professor.picture;

                newUser.save(function (err) {
                    if (err) {
                        console.error(err);
                        return err;
                    }else{
                        mailService.sendEmail({email: professor.email, password: password, accountType: 'PROFESSOR'});
                        console.log('Added new professor');
                        console.dir(newUser);
                        return newUser;
                    }
                });
            }
        });
    },
    getAllProfessors: function () {
        'use strict';
        return Professor.find({}).lean().exec();
    },
    deactivateProfessor: function (id) {
        'use strict';
        return Professor.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
    }
};