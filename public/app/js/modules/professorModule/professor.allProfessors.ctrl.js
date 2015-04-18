/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/professorModule/professor.module'], function (professorModule) {
    'use strict';

    professorModule
        .controller('allProfessorsCtrl', function ($scope, professorsService, $rootScope, ModalService, $location) {

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
                $location.path('/editProfessor/'+id);
            };

            $scope.deactivateProfessor = function (id) {
                professorsService.deactivateProfessor({id: id, userType: 'PROFESSOR'}).then(
                    function (data) {
                        var professor = _.find($scope.professors, function (professor) {
                            return professor._id === id;
                        });
                        professor.isActive = false;
                        $rootScope.$broadcast('toast-success', { message: 'Professor: ' + data.firstName + ' ' + data.lastName + ' deactivated'});
                    }, function (err) {
                        console.log(err);
                        $rootScope.$broadcast('toast-error', { message: err});
                    }
                );
            };

            $scope.showModalDialog = function(id) {
                var prof = _.find($scope.professors, function (professor) {
                    return professor._id === id;
                });
                ModalService.showModal({
                    templateUrl: 'js/modules/modalDialogModule/views/confirmModal.html',
                    controller: 'confirmModalCtrl',
                    inputs: {
                        firstName: prof.firstName,
                        lastName: prof.lastName
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if(result){
                            $scope.deactivateProfessor(id);
                        }
                    });
                });
            };
        });
});
