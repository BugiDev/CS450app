/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/attendanceModule/attendance.module'], function (attendanceModule) {
    'use strict';

    attendanceModule
        .controller('allLecturesCtrl', function ($scope, attendanceService, $location) {

            $scope.lectures = {};

            $scope.init = function () {
                attendanceService.getAllLectures().then(
                    function (data) {
                        $scope.lectures = data;
                    }, function (err) {
                        $scope.lectures = {};
                    }
                );
            };

            $scope.editAttendance = function(id){
                $location.path('/editLecture/' + id);
            };

        });
});
