/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['authModule/auth.module'], function (authModule) {
    'use strict';

    authModule
        .controller('authCtrl', function ($scope, userService, $location) {
            $scope.user = {
                email: '',
                password: ''
            };

            $scope.login = function () {
                userService.login($scope.user.email, $scope.user.password).then(
                    function (data) {
                        $location.path('/dashboard');
                    }, function (data) {
                        $scope.authForm['email'].$setValidity('loginError', false);
                    });
            };

        });
});
