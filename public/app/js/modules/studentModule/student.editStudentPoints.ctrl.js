/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/studentModule/student.module'], function (studentModule) {
    'use strict';

    studentModule
        .controller('editStudentPointsCtrl', function ($scope, studentsService, $state, $stateParams, $rootScope) {

            $scope.student = {
                id: $stateParams.id
            };
            $scope.preexamPoints = '';

            $scope.init = function(){
                studentsService.getStudentByID($scope.student.id).then(
                    function(data){
                        $scope.student = data;
                        $scope.calculatePreexamPoints();
                    },
                    function(err){
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.calculatePreexamPoints = function(){

                var achievedPoints = 0;
                var maxPoints = 0;

                for(var x in $scope.student.preexamPoints){
                    if($scope.student.preexamPoints[x].length > 0){
                        _.each($scope.student.preexamPoints[x], function(element, index, list){
                            achievedPoints += element.pointsAchieved;
                            maxPoints += element.maxPoints;
                        });
                    }
                }

                $scope.preexamPoints = achievedPoints + ' / ' + maxPoints;
            };

            $scope.init();

        });
});
