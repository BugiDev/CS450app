/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/userMgmtModule/userMgmt.module'], function (userMgmtModule) {
    'use strict';

    userMgmtModule
        .service('userService', function (authService, $state, $q, config, $http) {
            var self = this;
            this.user = undefined;
            this.auth = undefined;

            this.isAuthenticated = function () {
                var deferred = $q.defer();
                if (self.auth === undefined) {
                    self._checkIfAuthenticated().then(function (data) {
                        self.auth = true;
                        deferred.resolve(self.auth);
                    }, function (err) {
                        self.auth = false;
                        deferred.resolve(self.auth);
                    });
                } else {
                    deferred.resolve(self.auth);
                }

                return deferred.promise;
            };

            this._checkIfAuthenticated = function () {
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.isAuthenticatedUrl)
                    .success(function (data, status, headers, config) {
                        if(!self.user){
                            self.getUserProfile().then(function(){
                                deferred.resolve(data);
                            }, function(){
                                deferred.reject();
                            });
                        }else{
                            deferred.resolve(data);
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
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getUserProfileUrl)
                    .success(function (data, status, headers, config) {
                        console.log('User profile Success!');
                        console.debug(data);
                        self.user = data;
                        deferred.resolve();
                    }).
                    error(function (data, status, headers, config) {
                        console.log('User profile Error!');
                        console.debug(data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.login = function (email, password) {
                var deferred = $q.defer();
                authService.authenticate(email, password).then(
                    function (data) {
                        console.log('Login Success!');
                        console.debug(data);
                        self.user = data;
                        self.auth = true;
                        deferred.resolve(data);
                    }, function (data) {
                        console.log('Login Error!');
                        console.debug(data);
                        self.user = undefined;
                        self.auth = false;
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
                        self.auth = false;
                        $state.go('auth');
                    }, function (data) {
                        console.log('Logout Error!');
                        console.debug(data);
                        self.user = undefined;
                        self.auth = false;
                        $state.go('auth');
                    });
            };

        });
});
