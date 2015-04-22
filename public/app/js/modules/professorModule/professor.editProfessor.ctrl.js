/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/professorModule/professor.module'], function (professorModule) {
    'use strict';

    professorModule
        .controller('editProfessorCtrl', function ($scope, professorsService, $rootScope, $stateParams, $state) {

            $scope.professor = {
                id: $stateParams.id
            };

            $scope.tmpPicture = null;
            $scope.pictureStep = undefined;

            $scope.init = function(){
                professorsService.getProfessorByID($scope.professor.id).then(
                    function(data){
                        $scope.professor = data;
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

            $scope.editProfessor = function(){

                if($scope.tmpPicture){
                    $scope.professor.picture = $scope.tmpPicture;
                }

                professorsService.editProfessorProfile($scope.professor).then(
                    function(data){
                        console.log('Edit Professor success');
                        console.debug(data);
                        $rootScope.$broadcast('toast-success', { message: 'Edited professor: ' + data.firstName + ' ' + data.lastName });
                        $state.go('panel.content.allProfessors');
                    }, function(err){
                        console.log('Edit Professor error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.resetForm = function(){
                $scope.professor = {};
            };

            $scope.changePicture = function(){
                $scope.professor.picture = null;
            };

        });
});
