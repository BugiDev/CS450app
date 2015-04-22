/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/professorModule/professor.module'], function (professorModule) {
    'use strict';

    professorModule
        .controller('addNewProfessorCtrl', function ($scope, professorsService, $rootScope, $state) {

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
                        $rootScope.$broadcast('toast-success', { message: 'New professor: ' + data.firstName + ' ' + data.lastName + ' created'});
                        $state.go('panel.content.allProfessors');
                    }, function(err){
                        console.log('New User error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.resetForm = function(){
                $scope.professor = {};
            };

        });
});
