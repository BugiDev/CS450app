/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('addNewProfessorCtrl', function ($scope, professorsService) {

            $scope.professor = {
                picture: null,
                userType: 'PROFESSOR'
            };

            $scope.pictureStep = undefined;

            $scope.resetCrop = function(){
                $scope.professor.picture = null;
                $scope.pictureStep = 1;
            };

            $scope.createNewProfessor = function(){
                professorsService.createNewProfessor($scope.professor).then(
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
                $scope.professor = {};
            };

        });
});
