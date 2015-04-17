/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['angular', 'userMgmtModule/userMgmt.module'], function (angular, userMgmtModule) {
    'use strict';

    userMgmtModule
        .service('userService', function (authService, $state, $q, config, $http) {
            var self = this;
            this.user = undefined;
            var auth;

            this.isAuthenticated = function () {
                var deferred = $q.defer();
                if (auth === undefined) {
                    self._checkIfAuthenticated().then(function (data) {
                        auth = true;
                        deferred.resolve(auth);
                    }, function (err) {
                        auth = false;
                        deferred.resolve(auth);
                    });
                } else {
                    deferred.resolve(auth);
                }

                return deferred.promise;
            };

            this._checkIfAuthenticated = function () {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.isAuthenticatedUrl)
                    .success(function (data, status, headers, config) {
                        console.log('User is Authenticated!');
                        console.debug(data);
                        deferred.resolve(data);
                        if(!self.user){
                            self.getUserProfile();
                        }
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Auth Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.getUserProfile = function () {
                $http.get(config.apiBaseURL + config.getUserProfileUrl)
                    .success(function (data, status, headers, config) {
                        console.log('User profile Success!');
                        console.debug(data);
                        self.user = data;
                    }).
                    error(function (data, status, headers, config) {
                        console.log('User profile Error!');
                        console.debug(data);
                    });
            };

            this.login = function (email, password) {
                var deferred = $q.defer();
                authService.authenticate(email, password).then(
                    function (data) {
                        console.log('Login Success!');
                        console.debug(data);
                        self.user = data;
                        deferred.resolve(data);
                    }, function (data) {
                        console.log('Login Error!');
                        console.debug(data);
                        self.user = undefined;
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.logout = function () {
                authService.logout().then(
                    function (data) {
                        console.log('Logout Success!');
                        console.debug(data);
                        self.user = undefined;
                        $state.go('auth');
                    }, function (data) {
                        console.log('Logout Error!');
                        console.debug(data);
                        self.user = undefined;
                        $state.go('auth');
                    });
            };

        });
});
