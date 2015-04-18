/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/adminModule/admin.module'], function (adminModule) {
    'use strict';

    adminModule
        .controller('addNewAdminCtrl', function ($scope, adminsService, $rootScope, $stateParams, $state) {
            $scope.admin = {
                id: $stateParams.id
            };

            $scope.tmpPicture = null;
            $scope.pictureStep = undefined;

            $scope.init = function(){
                adminsService.getAdminByID($scope.admin.id).then(
                    function(data){
                        $scope.admin = data;
                    },
                    function(err){
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.resetCrop = function(){
                $scope.tmpPicture = null;
                $scope.pictureStep = 1;
            };

            $scope.editAdmin = function(){

                if($scope.tmpPicture){
                    $scope.admin.picture = $scope.tmpPicture;
                }

                adminsService.editAdmin($scope.admin).then(
                    function(data){
                        console.log('Edit Admin success');
                        console.debug(data);
                        $rootScope.$broadcast('toast-success', { message: 'Edited admin: ' + data.firstName + ' ' + data.lastName});
                        $state.go('panel.content.allAdmins');
                    }, function(err){
                        console.log('Edit Admin error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.resetForm = function(){
                $scope.admin = {};
            };

            $scope.changePicture = function(){
                $scope.admin.picture = null;
            };

        });
});
