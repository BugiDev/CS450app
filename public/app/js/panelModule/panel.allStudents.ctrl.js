/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('allStudentsCtrl', function ($scope, studentsService) {

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
                console.log('Edit student');
                console.debug(id);
            };

            $scope.deactivateStudent = function (id) {
                studentsService.deactivateStudent({id: id, userType: 'STUDENT'}).then(
                    function (data) {
                        var student = _.find($scope.students, function (student) {
                            return student._id === id;
                        });
                        student.isActive = false;
                    }, function (err) {
                        console.log(err);
                    }
                );
            };
        });
});
