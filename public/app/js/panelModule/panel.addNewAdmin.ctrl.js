/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('addNewAdminCtrl', function ($scope, adminsService) {
            $scope.userType = 'ADMIN';

            $scope.admin = {
                picture: null,
                userType: 'ADMIN'
            };

            $scope.pictureStep = undefined;

            $scope.resetCrop = function(){
                $scope.admin.picture = null;
                $scope.pictureStep = 1;
            };

            $scope.createNewAdmin = function(){
                adminsService.createNewAdmin($scope.admin).then(
                    function(data){
                        console.log('New User success');
                        console.debug(data);
                    }, function(err){
                        console.log('New User error');
                        console.log(err);
                    }
                );
            };

            $scope.resetForm = function(){
                $scope.admin = {};
            };

        });
});
