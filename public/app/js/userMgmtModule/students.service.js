/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['angular', 'userMgmtModule/userMgmt.module'], function (angular, userMgmtModule) {
    'use strict';

    userMgmtModule
        .service('studentsService', function ($http, $location, $q, config) {
            var self = this;
            this.students = undefined;

            this.getAllStudents = function(){
                var deferred = $q.defer();
                if(self.students){
                    deferred.resolve(self.students);
                }else{
                    $http.get(config.apiBaseURL + config.getAllStudentsUrl)
                        .success(function (data, status, headers, config) {
                            console.log('All Students Success!');
                            console.debug(data);
                            self.students = data;
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            console.log('All Students Error!');
                            self.students = undefined;
                            deferred.reject(data);
                        });
                }
                return deferred.promise;
            };

            this.createNewStudent = function(student){
                    var deferred = $q.defer();
                    $http.post(config.apiBaseURL + config.createNewUserUrl, {user: student})
                        .success(function (data, status, headers, config) {
                            console.log('New Student Success!');
                            console.debug(data);
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            console.log('New Student Error!');
                            console.debug(data);
                            deferred.reject({
                                status: status,
                                message: data
                            });
                        });

                    return deferred.promise;
            };

            this.deactivateStudent = function(user){
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.deactivateUserUrl, {id: user.id, userType: user.userType})
                    .success(function (data, status, headers, config) {
                        console.log('Deactivate Student Success!');
                        console.debug(data);
                        var student = _.find(self.students, function(student){ return student._id === user.id; });
                        student.isActive = false;
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Deactivate Student Error!');
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
