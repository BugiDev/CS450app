/**
 * Created by bogdanbegovic on 4/16/15.
 */
/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function () {
    'use strict';

    var Admin = require('../models/admin');
    var generatePassword = require('password-generator');

    this.updateAdmin = function(admin){
        Admin.findOneAndUpdate({'_id': admin.id}, admin, {upsert:false}).lean().exec();
    };

    this.createAdmin = function(admin){
        Admin.findOne({ 'email': admin.email }, function (err, user) {
            if (err) {
                return err;
            }
            if (user) {
                err = 'User already exists';
                return err;
            }
            if(!admin.email || !admin.firstName || !admin.lastName){
                err = 'Validation error';
                return err;
            }else {

                var newUser = new Admin();
                var password = generatePassword(12, false, /\d/, 'met');
                newUser.email = admin.email;
                newUser.firstName = admin.firstName;
                newUser.lastName = admin.lastName;
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

    this.getAllAdmins = function(){
        Admin.find({}).lean().exec();
    };

};