/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/attendanceModule/attendance.module'], function (attendanceModule) {
    'use strict';

    attendanceModule
        .controller('editLectureCtrl', function ($scope, studentsService, attendanceService, $location, $stateParams, $rootScope, $state, $q) {

            $scope.students = {};
            $scope.lecture = {
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
                attendanceService.getLectureById($scope.lecture.id).then(
                    function (data) {
                        $scope.lecture = data;
                        attendanceQ.resolve(data);
                    }, function (err) {
                        $scope.lecture = {};
                        attendanceQ.reject(err);
                    }
                );

                $q.all([tradStudentPromise, attendacePromise]).then(
                    function(data){
                        _.each($scope.students, function (element, index, list) {
                            element.isChecked = false;
                            _.each($scope.lecture.attenders, function (element2, index2, list2) {
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

            $scope.editLecture = function () {
                var attendersIds = [];
                _.each($scope.students, function (element, index, list) {
                    if (element.isChecked) {
                        attendersIds.push(element._id);
                    }
                });

                $scope.lecture.attenders = attendersIds;

                attendanceService.updateLecture($scope.lecture).then(
                    function (data) {
                        console.log('Edit Lecture success');
                        console.debug(data);
                        $rootScope.$broadcast('toast-success', { message: 'Edited lecture for week: ' + $scope.lecture.weekNum});
                        $state.go('panel.content.allLectures');
                    },
                    function (err) {
                        console.log('Edit Lecture error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            }

        });
});
