/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('dashboardCtrl', function ($scope, studentsService, attendanceService, $filter, $location) {

            $scope.students = {};
            $scope.chartDataLectures = [];
            $scope.chartDataLabs = [];

            $scope.init = function () {
                studentsService.getAllActiveStudents().then(
                    function (data) {
                        $scope.students = data;
                    }, function (err) {
                        $scope.students = err;
                    });

                attendanceService.getAllAttendance().then(
                    function (data) {
                        var lectures = _.filter(data, function (attendance) {
                            return attendance.attendanceType === 'LECTURES';
                        });
                        var labs = _.filter(data, function (attendance) {
                            return attendance.attendanceType === 'LABS';
                        });
                        for (var i = 0; i < 15; i++) {
                            $scope.chartDataLectures.push({
                                date: lectures[i].weekDate,
                                lectures: lectures[i].attenders.length
                            });
                            $scope.chartDataLabs.push({
                                date: labs[i].weekDate,
                                labs: labs[i].attenders.length
                            });
                        }
                        $scope.initLecturesChart();
                        $scope.initLabsChart();
                    }
                );
            };

            $scope.initLecturesChart = function () {
                Morris.Area({
                    element: 'morris-area-chart-lectures',
                    data: $scope.chartDataLectures,
                    xkey: 'date',
                    ykeys: ['lectures'],
                    labels: ['Lectures attendance'],
                    xLabels: 'day',
                    pointSize: 2,
                    hideHover: 'auto',
                    resize: true,
                    lineColors: ['#a70532'],
                    dateFormat: function(x){
                        return $filter('date')(x, 'dd/MM/yyyy');
                    }
                });
            };

            $scope.initLabsChart = function () {
                Morris.Area({
                    element: 'morris-area-chart-labs',
                    data: $scope.chartDataLabs,
                    xkey: 'date',
                    ykeys: ['labs'],
                    labels: ['Labs attendance'],
                    xLabels: 'day',
                    pointSize: 2,
                    hideHover: 'auto',
                    resize: true,
                    lineColors: ['#a7b3bc'],
                    dateFormat: function(x){
                        return $filter('date')(x, 'dd/MM/yyyy');
                    }
                });
            };

            $scope.init();

            $scope.editStudentPoints = function(id){
                $location.path('/editStudentPoints/' + id);
            };

        });
});
