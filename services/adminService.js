/**
 * Created by bogdanbegovic on 4/16/15.
 */

var Admin = require('../models/admin');
var generatePassword = require('password-generator');
var mailService = require('../services/mailService');

module.exports = {
    updateAdmin: function (admin) {
        'use strict';
        Admin.findOneAndUpdate({'_id': admin.id}, admin, {upsert: false}).lean().exec();
    },
    createAdmin: function (admin) {
        'use strict';
        Admin.findOne({'email': admin.email}, function (err, user) {
            if (err) {
                return err;
            }
            if (user) {
                err = 'User already exists';
                return err;
            }
            if (!admin.email || !admin.firstName || !admin.lastName) {
                err = 'Validation error';
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
                        console.error(err);
                        return err;
                    }else{
                        mailService.sendEmail({email: admin.email, password: password, accountType: 'ADMIN'});
                        console.log('Added new admin');
                        console.dir(newUser);
                        return newUser;
                    }
                });
            }
        });
    },
    getAllAdmins: function () {
        'use strict';
        return Admin.find({}).lean().exec();
    },
    deactivateAdmin: function (id) {
        'use strict';
        return Admin.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
    }};