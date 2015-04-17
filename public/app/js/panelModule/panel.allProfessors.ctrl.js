/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['panelModule/panel.module'], function (panelModule) {
    'use strict';

    panelModule
        .controller('allProfessorsCtrl', function ($scope, professorsService) {

            $scope.professors = {};

            $scope.init = function () {
                professorsService.getAllProfessors().then(
                    function (data) {
                        $scope.professors = data;
                    }, function (data) {
                        $scope.professors = {};
                    }
                );
            };

            $scope.editProfessor = function (id) {
                console.log('Edit student');
                console.debug(id);
            };

            $scope.deactivateProfessor = function (id) {
                professorsService.deactivateProfessor({id: id, userType: 'PROFESSOR'}).then(
                    function (data) {
                        var professor = _.find($scope.professors, function (professor) {
                            return professor._id === id;
                        });
                        professor.isActive = false;
                    }, function (err) {
                        console.log(err);
                    }
                );
            };
        });
});
