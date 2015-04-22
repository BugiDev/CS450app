/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('myProfileCtrl', function ($scope, userService, $state) {

            $scope.user = {};

            userService.getUserProfile().then(function(data){
                $scope.user = data;
            }, function(err){
                $scope.user = {};
            });

            $scope.editUser = function(){
                $state.go('panel.content.editProfile')
            };

        });
});
