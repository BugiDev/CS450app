/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (dashboardModule) {
    'use strict';

    dashboardModule
        .controller('sidebarNavCtrl', function ($scope, userService) {
            $scope.user = {};
            $scope.alerts = [];

            $scope.init = function(){
                $('#side-menu').metisMenu();
                userService.getUserProfile().then(function(data){
                    $scope.user = data;
                }, function(err){
                    $scope.user = {};
                });
            };

            $scope.init();

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            $scope.$on('toast-error', function (event, args) {
                $scope.alerts.push({type: 'danger', msg: args.message});

            });

            $scope.$on('toast-success', function (event, args) {
                $scope.alerts.push({type: 'success', msg: args.message});
            });

        });
});
