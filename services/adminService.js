/**
 * Created by bogdanbegovic on 4/16/15.
 */

module.exports = function (logger) {
    'use strict';
    var Admin = require('../models/admin');
    var generatePassword = require('password-generator');
    var mailService = require('../services/mailService')(logger);

    return {
        updateAdmin: function (admin) {
            return Admin.findOneAndUpdate({'_id': admin.id}, admin, {upsert: false}).lean().exec();
        },
        createAdmin: function (admin) {
            Admin.findOne({'email': admin.email}, function (err, user) {
                if (err) {
                    logger.error(err);
                    return err;
                }
                if (user) {
                    err = 'User already exists';
                    logger.error(err);
                    return err;
                }
                if (!admin.email || !admin.firstName || !admin.lastName) {
                    err = 'Validation error';
                    logger.error(err);
                    return err;
                } else {
                    var newUser = new Admin();
                    var password = generatePassword(12, false, /\d/, 'met');
                    newUser.email = admin.email;
                    newUser.firstName = admin.firstName;
                    newUser.lastName = admin.lastName;
                    newUser.password = newUser.generateHash(password);
                    newUser.picture = admin.picture;

                    newUser.save(function (err) {
                        if (err) {
                            logger.error(err);
                            return err;
                        } else {
                            mailService.sendEmail({email: admin.email, password: password, accountType: 'ADMIN'});
                            logger.info('Added new admin: ' + newUser._id);
                            return newUser;
                        }
                    });
                }
            });
        },
        getAllAdmins: function () {
            return Admin.find({}).lean().exec();
        },
        deactivateAdmin: function (id) {
            return Admin.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
        },
        getAdminByID: function (id) {
            return Admin.findOne({'_id': id}).lean().exec();
        }
    };
};