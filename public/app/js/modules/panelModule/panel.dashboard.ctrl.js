/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('dashboardCtrl', function ($scope, studentsService) {

            $scope.init = function () {
                Morris.Area({
                    element: 'morris-area-chart',
                    data: [{
                        date: '2015-10-1',
                        lectures: 15,
                        labs: 20
                    }, {
                        date: '2015-10-7',
                        lectures: 24,
                        labs: 14
                    }, {
                        date: '2015-10-14',
                        lectures: 33,
                        labs: 10
                    }, {
                        date: '2015-10-21',
                        lectures: 11,
                        labs: 28
                    }],
                    xkey: 'date',
                    ykeys: ['lectures', 'labs'],
                    labels: ['Lectures atendance', 'Labs atendance'],
                    xLabels: 'day',
                    pointSize: 2,
                    hideHover: 'auto',
                    resize: true,
                    lineColors: ['#a70532', '#a7b3bc']
                });

                studentsService.getAllStudents().then(
                    function (data) {
                        console.debug(data);
                    }, function (data) {
                        console.debug(data);
                    });
            };

            $scope.init();

        });
});
