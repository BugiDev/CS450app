/**
 * Created by bogdanbegovic on 4/16/15.
 */

module.exports = function (logger) {
    'use strict';
    var Professor = require('../models/professor');
    var generatePassword = require('password-generator');
    var mailService = require('../services/mailService')(logger);

    return {

        updateProfessor: function (professor) {
            return Professor.findOneAndUpdate({'_id': professor.id}, professor, {upsert: false}).lean().exec();
        },
        createProfessor: function (professor) {
            Professor.findOne({'email': professor.email}, function (err, user) {
                if (err) {
                    logger.error(err);
                    return err;
                }
                if (user) {
                    err = 'User already exists';
                    logger.error(err);
                    return err;
                }
                if (!professor.email || !professor.firstName || !professor.lastName) {
                    err = 'Validation error';
                    logger.error(err);
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
                            logger.error(err);
                            return err;
                        } else {
                            mailService.sendEmail({
                                email: professor.email,
                                password: password,
                                accountType: 'PROFESSOR'
                            });
                            logger.info('Added new professor: ' + newUser._id);
                            return newUser;
                        }
                    });
                }
            });
        },
        getAllProfessors: function () {
            return Professor.find({}).lean().exec();
        },
        deactivateProfessor: function (id) {
            return Professor.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
        },
        getProfessorByID: function (id) {
            return Professor.findOne({'_id': id}).lean().exec();
        }
    };
};