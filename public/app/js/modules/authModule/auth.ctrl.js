/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/authModule/auth.module'], function (authModule) {
    'use strict';

    authModule
        .controller('authCtrl', function ($scope, userService, $location) {
            $scope.user = {
                email: '',
                password: ''
            };

            $scope.errorMessage = '';

            $scope.formError = true;
            $scope.formNoUser = true;

            $scope.login = function () {
                $scope.formError = true;
                userService.login($scope.user.email, $scope.user.password).then(
                    function (data) {
                        $location.path('/dashboard');
                    }, function (data) {
                        $scope.errorMessage = data.message;
                        $scope.formError = false;
                    });
            };

        });
});
