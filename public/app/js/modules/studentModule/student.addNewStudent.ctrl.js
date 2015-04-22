/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/studentModule/student.module'], function (studentModule) {
    'use strict';

    studentModule
        .controller('addNewStudentCtrl', function ($scope, studentsService, $rootScope, $state) {
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
                        $rootScope.$broadcast('toast-success', { message: 'New student: ' + data.firstName + ' ' + data.lastName + ' created'});
                        $state.go('panel.content.allStudents');
                    }, function(err){
                        console.log('New User error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.resetForm = function(){
                $scope.student = {};
            };

        });
});
