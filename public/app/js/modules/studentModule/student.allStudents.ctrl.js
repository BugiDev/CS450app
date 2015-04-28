/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/studentModule/student.module'], function (studentModule) {
    'use strict';

    studentModule
        .controller('allStudentsCtrl', function ($scope, studentsService, userService, $rootScope, ModalService, $location) {

            $scope.students = undefined;
            $scope.user = {};

            $scope.init = function () {
                studentsService.getAllStudents().then(
                    function (data) {
                        $scope.students = data;
                    }, function (data) {
                        $scope.students = {};
                    }
                );
                userService.getUserProfile().then(function(data){
                    $scope.user = data;
                }, function(err){
                    $scope.user = {};
                });
            };

            $scope.editStudent = function (id) {
                $location.path('/editStudent/'+id);
            };

            $scope.deactivateStudent = function (id) {
                studentsService.deactivateStudent({id: id}).then(
                    function (data) {
                        var student = _.find($scope.students, function (student) {
                            return student._id === id;
                        });
                        student.isActive = false;
                        $rootScope.$broadcast('toast-success', { message: 'Student: ' + data.firstName + ' ' + data.lastName + ' deactivated'});
                    }, function (err) {
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
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
                            $scope.deactivateStudent(id);
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
                console.log('Reset password id: ' + id);
                studentsService.resetPassword(id).then(
                    function (data) {
                        $rootScope.$broadcast('toast-success', { message: 'Student: ' + data.firstName + ' ' + data.lastName + ' password reset'});
                    }, function (err) {
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.editStudentPoints = function(id){
                $location.path('/editStudentPoints/' + id);
            };

        });
});
