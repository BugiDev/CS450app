/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (dashboardModule) {
    'use strict';

    dashboardModule
        .controller('sidebarNavCtrl', function ($scope) {

            $scope.init = function(){
                $('#side-menu').metisMenu();
            };

            $scope.init();
        });
});
