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

            $scope.formError = true;
            $scope.formNoUser = true;

            $scope.login = function () {
                $scope.formError = true;
                $scope.formNoUser = true;
                userService.login($scope.user.email, $scope.user.password).then(
                    function (data) {
                        $location.path('/dashboard');
                    }, function (data) {
                        if(data.status === 404){
                            $scope.formNoUser = false;
                        }else{
                            $scope.formError = false;
                        }
                    });
            };

        });
});
