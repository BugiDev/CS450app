/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('addNewStudentCtrl', function ($scope, studentsService) {
            $scope.student = {
                picture: null,
                userType: 'STUDENT'
            };

            $scope.pictureStep = undefined;

            $scope.resetCrop = function(){
                $scope.student.picture = null;
                $scope.pictureStep = 1;
            };

            $scope.createNewStudent = function(){
                studentsService.createNewStudent($scope.student).then(
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
                $scope.student = {};
            };

        });
});
