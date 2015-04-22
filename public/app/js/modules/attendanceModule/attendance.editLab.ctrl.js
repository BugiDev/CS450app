/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/attendanceModule/attendance.module'], function (attendanceModule) {
    'use strict';

    attendanceModule
        .controller('editLabCtrl', function ($scope, studentsService, attendanceService, $location, $stateParams, $rootScope, $state, $q) {

            $scope.students = {};
            $scope.lab = {
                id: $stateParams.id
            };

            $scope.init = function () {

                var tradStudentQ = $q.defer();
                var attendanceQ = $q.defer();
                var tradStudentPromise = tradStudentQ.promise;
                var attendacePromise = attendanceQ.promise;

                studentsService.getAllTraditionalStudents().then(
                    function (data) {
                        $scope.students = data;
                        tradStudentQ.resolve(data);
                    }, function (err) {
                        $scope.students = {};
                        tradStudentQ.reject(err);
                    }
                );
                attendanceService.getLabById($scope.lab.id).then(
                    function (data) {
                        $scope.lab = data;
                        attendanceQ.resolve(data);
                    }, function (err) {
                        $scope.lab = {};
                        attendanceQ.reject(err);
                    }
                );

                $q.all([tradStudentPromise, attendacePromise]).then(
                    function(data){
                        _.each($scope.students, function (element, index, list) {
                            element.isChecked = false;
                            _.each($scope.lab.attenders, function (element2, index2, list2) {
                                if(element._id === element2){
                                    element.isChecked = true;
                                }
                            });
                        })
                    },
                    function(err){
                        console.log(err);
                    }
                );
            };

            $scope.toggleCustom = function(student) {
                student.isChecked = student.isChecked === false ? true: false;
            };

            $scope.resetForm = function () {
                _.each($scope.students, function (element, index, list) {
                    element.isChecked = false;
                })
            };

            $scope.editLab = function () {
                var attendersIds = [];
                _.each($scope.students, function (element, index, list) {
                    if (element.isChecked) {
                        attendersIds.push(element._id);
                    }
                });

                $scope.lab.attenders = attendersIds;

                attendanceService.updateLab($scope.lab).then(
                    function (data) {
                        console.log('Edit Lab success');
                        console.debug(data);
                        $rootScope.$broadcast('toast-success', { message: 'Edited lab for week: ' + $scope.lab.weekNum});
                        $state.go('panel.content.allLabs');
                    },
                    function (err) {
                        console.log('Edit Lab error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            }

        });
});
