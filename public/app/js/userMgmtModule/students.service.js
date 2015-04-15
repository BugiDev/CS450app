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
                $http.get(config.apiBaseURL + config.allStudentsUrl)
                    .success(function (data, status, headers, config) {
                        console.log('All Students Success!');
                        deferred.resolve();
                    }).
                    error(function (data, status, headers, config) {
                        console.log('All Students Error!');
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

        });
});
