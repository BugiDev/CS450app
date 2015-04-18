/**
 * Created by bogdanbegovic on 4/16/15.
 */

module.exports = function (logger) {
    'use strict';

    var Student = require('../models/student');
    var generatePassword = require('password-generator');
    var mailService = require('../services/mailService')(logger);

    return {
        updateStudent: function (student) {
            return Student.findOneAndUpdate({'_id': student._id}, student, {upsert: false}).lean().exec();
        },
        createStudent: function (student) {
            Student.findOne({'email': student.email}, function (err, user) {
                if (err) {
                    logger.error(err);
                    return err;
                }
                if (user) {
                    err = 'User already exists';
                    logger.error(err);
                    return err;
                }
                if (!student.email || !student.firstName || !student.lastName || !student.studentType || !student.generation) {
                    err = 'Validation error';
                    logger.error(err);
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
                            logger.error(err);
                            return err;
                        } else {
                            mailService.sendEmail({
                                email: student.email,
                                password: password,
                                accountType: 'STUDENT'
                            });
                            logger.info('Added new student: ' + newUser._id);
                            return newUser;
                        }
                    });
                }
            });
        },
        getAllStudents: function () {
            return Student.find({}).lean().exec();
        },
        deactivateStudent: function (id) {
            return Student.findOneAndUpdate({'_id': id}, {isActive: false}, {upsert: false}).lean().exec();
        },
        getStudentByID: function (id) {
            return Student.findOne({'_id': id}).lean().exec();
        }
    };
};