/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/professorModule/professor.module'], function (professorModule) {
    'use strict';

    professorModule
        .service('professorsService', function ($http, $location, $q, config) {
            var self = this;

            this.getProfessorByID = function (id) {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getProfessorByIdUrl + id)
                    .success(function (data, status, headers, config) {
                        console.log('Get Professors by ID Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get Professors by ID Error!');
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.getAllProfessors = function () {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllProfessorsUrl)
                    .success(function (data, status, headers, config) {
                        console.log('All Professors Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('All Professors Error!');
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.setProfessorProfile = function (professor) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.setProfessorProfileUrl, {user: professor})
                    .success(function (data, status, headers, config) {
                        console.log('Set Professor Profile Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Set Professor Profile Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.editProfessorProfile = function (professor) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.editProfessorProfileUrl, {user: professor})
                    .success(function (data, status, headers, config) {
                        console.log('Edit Professor profile Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Edit Professor profile Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.createNewProfessor = function (professor) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.createNewProfessorUrl, {user: professor})
                    .success(function (data, status, headers, config) {
                        console.log('New Professor Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('New Professor Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.deactivateProfessor = function (user) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.deactivateProfessorUrl, {id: user.id})
                    .success(function (data, status, headers, config) {
                        console.log('Deactivate professor Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Deactivate professor Error!');
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
                $http.post(config.apiBaseURL + config.resetPasswordProfessorUrl, {id: id})
                    .success(function (data, status, headers, config) {
                        console.log('Reset Professor Password Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Reset Professor Password Error!');
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
