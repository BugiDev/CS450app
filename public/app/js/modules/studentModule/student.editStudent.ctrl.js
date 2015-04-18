/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/studentModule/student.module'], function (studentModule) {
    'use strict';

    studentModule
        .controller('editStudentCtrl', function ($scope, studentsService, $rootScope, $stateParams, $state) {

            $scope.student = {
                id: $stateParams.id
            };
            $scope.tmpPicture = null;
            $scope.pictureStep = undefined;

            $scope.init = function(){
                studentsService.getStudentByID($scope.student.id).then(
                    function(data){
                        $scope.student = data;
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

            $scope.editStudent = function(){

                if($scope.tmpPicture){
                    $scope.student.picture = $scope.tmpPicture;
                }

                studentsService.editStudentProfile($scope.student).then(
                    function(data){
                        console.log('Edit Student success');
                        console.debug(data);
                        $rootScope.$broadcast('toast-success', { message: 'Edit Student: ' + data.firstName + ' ' + data.lastName});
                        $state.go('panel.content.allStudents');
                    }, function(err){
                        console.log('Edit Student error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.resetForm = function(){
                $scope.student = {};
            };

            $scope.changePicture = function(){
                $scope.student.picture = null;
            };

        });
});
