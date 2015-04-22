/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (dashboardModule) {
    'use strict';

    dashboardModule
        .controller('sidebarNavCtrl', function ($scope, userService) {
            $scope.user = {};
            $scope.init = function(){
                $('#side-menu').metisMenu();
                userService.getUserProfile().then(function(data){
                    $scope.user = data;
                }, function(err){
                    $scope.user = {};
                });
            };

            $scope.init();
        });
});
