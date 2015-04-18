/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('myProfileCtrl', function ($scope, userService) {
            $scope.user = userService.user;
        });
});
