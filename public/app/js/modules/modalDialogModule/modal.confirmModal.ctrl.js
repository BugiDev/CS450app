/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/modalDialogModule/modal.module'], function (modalModule) {
    'use strict';

    modalModule
        .controller('confirmModalCtrl', function ($scope, close, firstName, lastName) {
            $scope.firstName = firstName;
            $scope.lastName = lastName;
            $scope.close = function (result) {
                close(result, 500); // close, but give 500ms for bootstrap to animate
            };
        });
});
