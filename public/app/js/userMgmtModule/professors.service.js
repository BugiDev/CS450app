/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['angular', 'userMgmtModule/userMgmt.module'], function (angular, userMgmtModule) {
    'use strict';

    userMgmtModule
        .service('professorsService', function ($http, $location, $q, config) {
            var self = this;
            this.professors = undefined;

            this.getAllProfessors = function(){
                var deferred = $q.defer();
                if(self.professors){
                    deferred.resolve(self.professors);
                }else{
                    $http.get(config.apiBaseURL + config.getAllProfessorsUrl)
                        .success(function (data, status, headers, config) {
                            console.log('All Professors Success!');
                            self.professors = data;
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            console.log('All Professors Error!');
                            self.professors = undefined;
                            deferred.reject(data);
                        });
                }
                return deferred.promise;
            };

            this.createNewProfessor = function(professor){
                    var deferred = $q.defer();
                    $http.post(config.apiBaseURL + config.createNewUserUrl, {user: professor})
                        .success(function (data, status, headers, config) {
                            console.log('New Professor Success!');
                            console.debug(data);
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            console.log('New Professor Error!');
                            console.debug(data);
                            deferred.reject({
                                status: status,
                                message: data
                            });
                        });

                    return deferred.promise;
            };

            this.deactivateProfessor = function(user){
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.deactivateUserUrl, {id: user.id, userType: user.userType})
                    .success(function (data, status, headers, config) {
                        console.log('Deactivate professor Success!');
                        console.debug(data);
                        var professor = _.find(self.professors, function(professor){ return professor._id === user.id; });
                        professor.isActive = false;
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Deactivate professor Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;

            };

        });
});
