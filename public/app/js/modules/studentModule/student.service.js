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
                $http.post(config.apiBaseURL + config.deactivateStudentUrl, {id: user.id, userType: user.userType})
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

        });
});
