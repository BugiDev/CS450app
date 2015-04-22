/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('editProfileCtrl', function ($scope, userService, studentsService, professorsService, adminsService, $rootScope, $stateParams, $state) {

            $scope.user = {};
            $scope.tmpPicture = null;
            $scope.pictureStep = undefined;
            $scope.password = '';
            $scope.passwordRepeat = '';

            $scope.errorMessage = '';
            $scope.passwordError = true;
            $scope.passwordRepeatError = true;

            $scope.init = function(){
                userService.getUserProfile().then(function (data) {
                    $scope.user = data;
                }, function (err) {
                    $scope.user = {};
                });
            };

            $scope.resetCrop = function () {
                $scope.tmpPicture = null;
                $scope.pictureStep = 1;
            };

            $scope.editUserProfile = function () {
                console.log('edit user profile');
                $scope.passwordError = true;
                $scope.passwordRepeatError = true;

                if ($scope.tmpPicture) {
                    $scope.user.picture = $scope.tmpPicture;
                }

                if($scope.password !== $scope.user.password && $scope.password !== ''){
                    if($scope.password.length < 8){
                        $scope.passwordError = false;
                        $scope.errorMessage = 'Password has to be at least 8 characters long';
                    }else if($scope.password !== $scope.passwordRepeat){
                        $scope.passwordRepeatError = false;
                        $scope.errorMessage = 'Password has to be same as new password';
                    }
                    $scope.user.password = $scope.password;
                }

                if($scope.passwordError === true && $scope.passwordRepeatError === true){

                    if ($scope.user.userType === 'ADMIN') {
                        adminsService.setAdminProfile($scope.user).then(
                            function (data) {
                                console.log('Edit Profile success');
                                console.debug(data);
                                userService.getUserProfile().then(
                                    function(user){
                                        $rootScope.$broadcast('toast-success', {message: 'You have successfully edited your profile'});
                                        if(user.password !== data.password){
                                            userService.logout();
                                            $state.go('auth');
                                        }else{
                                            $state.go('panel.content.myProfile');
                                        }
                                    },
                                    function(err){
                                        console.error(err);
                                        $rootScope.$broadcast('toast-error', {message: err.message});
                                    }
                                )
                            }, function (err) {
                                console.log('Edit Profile error');
                                console.log(err);
                                $rootScope.$broadcast('toast-error', {message: err.message});
                            }
                        );
                    } else if ($scope.user.userType === 'PROFESSOR') {
                        professorsService.setProfessorProfile($scope.user).then(
                            function (data) {
                                console.log('Edit Profile success');
                                console.debug(data);
                                userService.getUserProfile().then(
                                    function(user){
                                        $rootScope.$broadcast('toast-success', {message: 'You have successfully edited your profile'});
                                        if(user.password !== data.password){
                                            userService.logout();
                                            $state.go('auth');
                                        }else{
                                            $state.go('panel.content.myProfile');
                                        }
                                    },
                                    function(err){
                                        console.error(err);
                                        $rootScope.$broadcast('toast-error', {message: err.message});
                                    }
                                )
                            }, function (err) {
                                console.log('Edit Profile error');
                                console.log(err);
                                $rootScope.$broadcast('toast-error', {message: err.message});
                            }
                        );
                    } else if ($scope.user.userType === 'STUDENT') {
                        studentsService.setStudentProfile($scope.user).then(
                            function (data) {
                                console.log('Edit Profile success');
                                console.debug(data);
                                userService.getUserProfile().then(
                                    function(user){
                                        $rootScope.$broadcast('toast-success', {message: 'You have successfully edited your profile'});
                                        if(user.password !== data.password){
                                            userService.logout();
                                            $state.go('auth');
                                        }else{
                                            $state.go('panel.content.myProfile');
                                        }
                                    },
                                    function(err){
                                        console.error(err);
                                        $rootScope.$broadcast('toast-error', {message: err.message});
                                    }
                                )
                            }, function (err) {
                                console.log('Edit Profile error');
                                console.log(err);
                                $rootScope.$broadcast('toast-error', {message: err.message});
                            }
                        );
                    }
                }

            };

            $scope.resetForm = function () {
                $scope.user = {};
            };

            $scope.changePicture = function () {
                $scope.user.picture = null;
            };

        });
});
