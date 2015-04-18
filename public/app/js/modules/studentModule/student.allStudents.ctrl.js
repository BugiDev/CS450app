/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/studentModule/student.module'], function (studentModule) {
    'use strict';

    studentModule
        .controller('allStudentsCtrl', function ($scope, studentsService, $rootScope, ModalService, $location) {

            $scope.students = {};

            $scope.init = function () {
                studentsService.getAllStudents().then(
                    function (data) {
                        $scope.students = data;
                    }, function (data) {
                        $scope.students = {};
                    }
                );
            };

            $scope.editStudent = function (id) {
                $location.path('/editStudent/'+id);
            };

            $scope.deactivateStudent = function (id) {
                studentsService.deactivateStudent({id: id, userType: 'STUDENT'}).then(
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

            $scope.showModalDialog = function(id) {
                var stud = _.find($scope.students, function (student) {
                    return student._id === id;
                });
                ModalService.showModal({
                    templateUrl: 'js/modules/modalDialogModule/views/confirmModal.html',
                    controller: 'confirmModalCtrl',
                    inputs: {
                        firstName: stud.firstName,
                        lastName: stud.lastName
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

        });
});
