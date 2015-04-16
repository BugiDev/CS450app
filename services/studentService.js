/**
 * Created by bogdanbegovic on 4/16/15.
 */
/**
 * Created by bogdanbegovic on 4/13/15.
 */

module.exports = function () {
    'use strict';

    var Student = require('../models/student');
    var generatePassword = require('password-generator');

    this.updateStudent = function(student){
        Student.findOneAndUpdate({'_id': student.id}, student, {upsert:false}).lean().exec();
    };

    this.createStudent = function(student){
        Student.findOne({ 'email': student.email }, function (err, user) {
            if (err) {
                return err;
            }
            if (user) {
                err = 'User already exists';
                return err;
            }
            if(!student.email || !student.firstName || !student.lastName || !student.studentType || !student.generation){
                err = 'Validation error';
                return err;
            }else {

                var newUser = new Student();
                var password = generatePassword(12, false, /\d/, 'met');
                newUser.email = student.email;
                newUser.firstName = student.firstName;
                newUser.lastName = student.lastName;
                newUser.password = newUser.generateHash(password);
                newUser.studentType = student.studentType;
                newUser.generation = student.generation;

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

    this.getAllStudents = function(){
        Student.find({}).lean().exec();
    };
};