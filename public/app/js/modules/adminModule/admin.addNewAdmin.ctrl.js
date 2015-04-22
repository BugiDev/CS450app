/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/adminModule/admin.module'], function (adminModule) {
    'use strict';

    adminModule
        .controller('addNewAdminCtrl', function ($scope, adminsService, $rootScope, $state) {
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
                        $rootScope.$broadcast('toast-success', { message: 'New admin: ' + data.firstName + ' ' + data.lastName + ' created'});
                        $state.go('panel.content.allAdmins');
                    }, function(err){
                        console.log('New User error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.resetForm = function(){
                $scope.admin = {};
            };

        });
});
