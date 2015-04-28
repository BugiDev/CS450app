/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/adminModule/admin.module'], function (adminModule) {
    'use strict';

    adminModule
        .service('adminsService', function ($http, $location, $q, config) {
            var self = this;

            this.getAdminByID = function (id) {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAdminByIdUrl + id)
                    .success(function (data, status, headers, config) {
                        console.log('Get Admin by ID Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get Admin by ID Error!');
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.getAllAdmins = function () {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllAdminsUrl)
                    .success(function (data, status, headers, config) {
                        console.log('All Admins Success!');
                        self.admins = data;
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('All Admins Error!');
                        self.admins = undefined;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.setAdminProfile = function (admin) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.setAdminProfileUrl, {user: admin})
                    .success(function (data, status, headers, config) {
                        console.log('Set Admin Profile Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Set Admin Profile Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.editAdminProfile = function (admin) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.editAdminProfileUrl, {user: admin})
                    .success(function (data, status, headers, config) {
                        console.log('Edit Admin Profile Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Edit Admin Profile Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.createNewAdmin = function (admin) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.createNewAdminUrl, {user: admin})
                    .success(function (data, status, headers, config) {
                        console.log('New Admin Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('New Admin Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.deactivateAdmin = function (user) {
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.deactivateAdminUrl, {id: user.id})
                    .success(function (data, status, headers, config) {
                        console.log('Deactivate admin Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Deactivate admin Error!');
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
                $http.post(config.apiBaseURL + config.resetPasswordAdminUrl, {id: id})
                    .success(function (data, status, headers, config) {
                        console.log('Reset Admin Password Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Reset Admin Password Error!');
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
