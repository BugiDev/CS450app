/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/attendanceModule/attendance.module'], function (attendanceModule) {
    'use strict';

    attendanceModule
        .service('attendanceService', function ($http, config, $q) {

            this.getAllAttendance = function(){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllAttendanceUrl)
                    .success(function (data, status, headers, config) {
                        console.log('Get all attendance Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get all attendance Error!');
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.getAllLectures = function(){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllLecturesUrl)
                    .success(function (data, status, headers, config) {
                        console.log('Get all lectures Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get all lectures Error!');
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.getAllLabs = function(){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getAllLabsUrl)
                    .success(function (data, status, headers, config) {
                        console.log('Get all labs Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get all labs Error!');
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.getLectureById = function(id){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getLectureByIdUrl + id)
                    .success(function (data, status, headers, config) {
                        console.log('Get lecture by id Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get lecture by id Error!');
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.getLabById = function(id){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.getLabByIdUrl + id)
                    .success(function (data, status, headers, config) {
                        console.log('Get lab by id Success!');
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Get lab by id Error!');
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.updateLecture = function(week){
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.updateLectureUrl, {week: week})
                    .success(function (data, status, headers, config) {
                        console.log('Update Lecture Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Update Lecture Error!');
                        console.debug(data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.updateLab = function(week){
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.updateLabUrl, {week: week})
                    .success(function (data, status, headers, config) {
                        console.log('Update lab Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Update lab Error!');
                        console.debug(data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

        });
});
