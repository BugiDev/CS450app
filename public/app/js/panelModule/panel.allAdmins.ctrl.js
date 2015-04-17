/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('allAdminsCtrl', function ($scope, adminsService) {

            $scope.admins = {};

            $scope.init = function () {
                adminsService.getAllAdmins().then(
                    function (data) {
                        $scope.admins = data;
                    }, function (data) {
                        $scope.admins = {};
                    }
                );
            };

            $scope.editAdmin = function (id) {
                console.log('Edit student');
                console.debug(id);
            };

            $scope.deactivateAdmin = function (id) {
                adminsService.deactivateAdmin({id: id, userType: 'ADMIN'}).then(
                    function (data) {
                        var admin = _.find($scope.admins, function (admin) {
                            return admin._id === id;
                        });
                        admin.isActive = false;
                    }, function (err) {
                        console.log(err);
                    }
                );
            };
        });
});
