/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/studentViewModule/studentView.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('studentViewDashboardCtrl', function ($scope, userService, $state) {

            $scope.student = {};
            $scope.preexamPoints = '';
            $scope.totalPoints = '';

            $scope.init = function(){

                $('.main-content').css('background-color', '#fff');

                userService.getUserProfile().then(function(data){
                    $scope.student = data;

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

                }, function(err){
                    $scope.student = {};
                });

            };

            $scope.init();

            $scope.editProile = function(){
                $state.go('panel.studentViewEditProfile');
            };

        });
});
