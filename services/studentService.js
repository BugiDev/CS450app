/**
 * Created by bogdanbegovic on 4/16/15.
 */

var Student = require('../models/student');
var generatePassword = require('password-generator');
var mailService = require('../services/mailService');

module.exports = {
    updateStudent: function (student) {
        'use strict';
        Student.findOneAndUpdate({'_id': student.id}, student, {upsert: false}).lean().exec();
    },
    createStudent: function (student) {
        'use strict';
        Student.findOne({'email': student.email}, function (err, user) {
            if (err) {
                return err;
            }
            if (user) {
                err = 'User already exists';
                return err;
            }
            if (!student.email || !student.firstName || !student.lastName || !student.studentType || !student.generation) {
                err = 'Validation error';
                return err;
            } else {
                var newUser = new Student();
                var password = generatePassword(12, false, /\d/, 'met');
                newUser.email = student.email;
                newUser.firstName = student.firstName;
                newUser.lastName = student.lastName;
                newUser.password = newUser.generateHash(password);
                newUser.studentType = student.studentType;
                newUser.generation = student.generation;
                newUser.indexNum = student.indexNum;
                newUser.picture = student.picture;

                newUser.save(function (err) {
                    if (err) {
                        console.error(err);
                        return err;
                    } else {
                        mailService.sendEmail({email: student.email, password: password, accountType: 'STUDENT'});
                        console.log('Added new student');
                        console.dir(newUser);
                        return newUser;
                    }
                });
            }
        });
    },
    getAllStudents: function () {
        'use strict';
        return Student.find({}).lean().exec();
    },
    deactivateStudent: function (id) {
        'use strict';
        return Student.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
    }
};