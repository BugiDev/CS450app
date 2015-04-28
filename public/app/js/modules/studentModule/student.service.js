/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/studentModule/student.module'], function (studentModule) {
    'use strict';

    studentModule
        .service('studentsService', function ($http, $location, $q, config) {
            var self = this;

            this.getStudentByID = function (id) {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getStudentByIdUrl + id)
                    .success(function (data, status, headers, config) {
                        console.log('Get Student by ID Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get Student by ID Error!');
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.getAllStudents = function () {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllStudentsUrl)
                    .success(function (data, status, headers, config) {
                        console.log('All Students Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('All Students Error!');
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.getAllTraditionalStudents = function(){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllTraditionalStudentsUrl)
                    .success(function (data, status, headers, config) {
                        console.log('All Traditional Students Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('All Traditional Students Error!');
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.getAllActiveStudents = function(){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllActiveStudentsUrl)
                    .success(function (data, status, headers, config) {
                        console.log('All Active Students Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('All Active Students Error!');
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.setStudentProfile = function (student) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.setStudentProfileUrl, {user: student})
                    .success(function (data, status, headers, config) {
                        console.log('Set Student profile Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Set Student profile Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.editStudentProfile = function (student) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.editStudentProfileUrl, {user: student})
                    .success(function (data, status, headers, config) {
                        console.log('Edit Student profile Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Edit Student profile Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.updatePreexamPoints = function (id, preexamPoints) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.updatePreexamPointsUrl, {id: id, preexamPoints: preexamPoints})
                    .success(function (data, status, headers, config) {
                        console.log('Updating preexam points Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Updating preexam points Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.updateExamPoints = function (id, examPoints) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.updateExamPointsUrl, {id: id, examPoints: examPoints})
                    .success(function (data, status, headers, config) {
                        console.log('Updating exam points Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Updating exam points Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.createNewStudent = function (student) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.createNewStudentUrl, {user: student})
                    .success(function (data, status, headers, config) {
                        console.log('New Student Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('New Student Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.deactivateStudent = function (user) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.deactivateStudentUrl, {id: user.id})
                    .success(function (data, status, headers, config) {
                        console.log('Deactivate Student Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Deactivate Student Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;

            };

            this.resetPassword = function (id) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.resetPasswordStudentUrl, {id: id})
                    .success(function (data, status, headers, config) {
                        console.log('Reset Student Password Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Reset Student Password Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });
                return deferred.promise;

            };

        });
});
