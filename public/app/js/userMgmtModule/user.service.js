/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['angular', 'userMgmtModule/userMgmt.module'], function (angular, userMgmtModule) {
    'use strict';

    userMgmtModule
        .service('userService', function (authService, $location, $q) {
            var self = this;
            this.user = undefined;
            this.isAuthenticated = function () {
                return !!this.user;
            };

            this.login = function (email, password) {
                var deferred = $q.defer();
                authService.authenticate(email, password).then(
                    function (data) {
                        console.log('Login Success!');
                        console.debug(data);
                        self.user = data;
                        deferred.resolve();
                    }, function (data) {
                        console.log('Login Error!');
                        console.debug(data);
                        self.user = undefined;
                        deferred.reject();
                    });
                return deferred.promise;
            };

            this.logout = function () {
                authService.authenticate().then(
                    function (data) {
                        console.log('Logout Success!');
                        console.debug(data);
                        this.user = undefined;
                        $location.path('/login');
                    }, function (data) {
                        console.log('Logout Error!');
                        console.debug(data);
                        this.user = undefined;
                        $location.path('/login');
                    });
            };

        });
});
