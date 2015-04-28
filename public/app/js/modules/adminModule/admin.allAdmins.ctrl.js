/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/adminModule/admin.module'], function (adminModule) {
    'use strict';

    adminModule
        .controller('allAdminsCtrl', function ($scope, adminsService, userService, $rootScope, ModalService, $location, $state) {

            $scope.admins = undefined;

            $scope.init = function () {
                adminsService.getAllAdmins().then(
                    function (data) {
                        $scope.admins = data;
                    }, function (data) {
                        $scope.admins = {};
                    }
                );
            };

            $scope.editAdmin = function (id) {
                $location.path('/editAdmin/'+id);
            };

            $scope.deactivateAdmin = function (id) {
                adminsService.deactivateAdmin({id: id}).then(
                    function (data) {
                        var admin = _.find($scope.admins, function (admin) {
                            return admin._id === id;
                        });
                        admin.isActive = false;
                        $rootScope.$broadcast('toast-success', { message: 'Admin: ' + data.firstName + ' ' + data.lastName + ' deactivated'});
                    }, function (err) {
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.isCurrentUser = function(id){
                return id === userService.user._id;
            };

            $scope.editMyProfile = function(){
                $state.go('panel.content.editProfile');
            };

            $scope.showModalDialog = function(id, firstName, lastName) {
                ModalService.showModal({
                    templateUrl: 'js/modules/modalDialogModule/views/confirmModal.html',
                    controller: 'confirmModalCtrl',
                    inputs: {
                        firstName: firstName,
                        lastName: lastName
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if(result){
                            $scope.deactivateAdmin(id);
                        }
                    });
                });
            };

            $scope.showResetPasswordModalDialog = function(id, firstName, lastName) {
                ModalService.showModal({
                    templateUrl: 'js/modules/modalDialogModule/views/resetPasswordModal.html',
                    controller: 'resetPasswordModalCtrl',
                    inputs: {
                        firstName: firstName,
                        lastName: lastName
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if(result){
                            $scope.resetPassword(id);
                        }
                    });
                });
            };

            $scope.resetPassword = function (id) {
                adminsService.resetPassword(id).then(
                    function (data) {
                        $rootScope.$broadcast('toast-success', { message: 'Professor: ' + data.firstName + ' ' + data.lastName + ' password reset'});
                    }, function (err) {
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

        });
});
