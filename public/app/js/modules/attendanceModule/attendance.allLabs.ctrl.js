/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/attendanceModule/attendance.module'], function (attendanceModule) {
    'use strict';

    attendanceModule
        .controller('allLabsCtrl', function ($scope, attendanceService, $location) {

            $scope.labs = {};

            $scope.init = function () {
                attendanceService.getAllLabs().then(
                    function (data) {
                        $scope.labs = data;
                    }, function (err) {
                        $scope.labs = {};
                    }
                );
            };

            $scope.editAttendance = function(id){
                $location.path('/editLab/' + id);
            };

        });
});
