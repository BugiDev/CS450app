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
            $scope.totalPoints = '';

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

            $scope.$watch(function(){
                return ['student.preexamPoints','student.examPoints'].map(angular.bind($scope, $scope.$eval));
            }, function(newV){
                var achievedPoints = 0;
                var maxPoints = 0;

                for(var x in $scope.student.preexamPoints){
                    if($scope.student.preexamPoints[x].length > 0){
                        _.each($scope.student.preexamPoints[x], function(element, index, list){
                            if(element.pointsAchieved){
                                achievedPoints += element.pointsAchieved;
                            }
                            if(element.maxPoints){
                                maxPoints += element.maxPoints;
                            }
                        });
                    }
                }

                $scope.preexamPoints = achievedPoints + ' / ' + maxPoints;

                $scope.totalPoints = (achievedPoints + ($scope.student.examPoints.pointsAchieved || 0)) + ' / ' + (maxPoints + ($scope.student.examPoints.maxPoints || 0));
            },true);

            $scope.editPreexamPoints = function(){
                studentsService.updatePreexamPoints($scope.student._id, $scope.student.preexamPoints).then(
                    function(data){
                        console.log('Edit Student preexam points success');
                        console.debug(data);
                        $rootScope.$broadcast('toast-success', { message: 'Edited preexam points for: ' + $scope.student.firstName + ' ' + $scope.student.lastName});
                    },
                    function(err){
                        console.log('Edit Student preexam points error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.editExamPoints = function(){
                studentsService.updateExamPoints($scope.student._id, $scope.student.examPoints).then(
                    function(data){
                        console.log('Edit Student exam points success');
                        console.debug(data);
                        $rootScope.$broadcast('toast-success', { message: 'Edited exam points for: ' + $scope.student.firstName + ' ' + $scope.student.lastName});
                    },
                    function(err){
                        console.log('Edit Student exam points error');
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.addNewPointsRow = function(pointsType){

                var maxOrdinalNumber = 0;

                if($scope.student.preexamPoints[pointsType].length > 0){
                    _.each($scope.student.preexamPoints[pointsType], function(element, index, list){
                        if(maxOrdinalNumber < element.ordinalNum){
                            maxOrdinalNumber = element.ordinalNum;
                        }
                    });
                }

                $scope.student.preexamPoints[pointsType].push({ordinalNum: maxOrdinalNumber+1});
            };

            $scope.init();

        });
});
