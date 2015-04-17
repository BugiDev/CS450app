/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['angular', 'userMgmtModule/userMgmt.module'], function (angular, userMgmtModule) {
    'use strict';

    userMgmtModule
        .service('adminsService', function ($http, $location, $q, config) {
            var self = this;
            this.admins = undefined;

            this.getAllAdmins = function(){
                var deferred = $q.defer();
                if(self.admins){
                    deferred.resolve(self.admins);
                }else{
                    $http.get(config.apiBaseURL + config.getAllAdminsUrl)
                        .success(function (data, status, headers, config) {
                            console.log('All Admins Success!');
                            self.admins = data;
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            console.log('All Admins Error!');
                            self.admins = undefined;
                            deferred.reject(data);
                        });
                }
                return deferred.promise;
            };

            this.createNewAdmin = function(admin){
                    var deferred = $q.defer();
                    $http.post(config.apiBaseURL + config.createNewUserUrl, {user: admin})
                        .success(function (data, status, headers, config) {
                            console.log('New Admin Success!');
                            console.debug(data);
                            deferred.resolve(data);
                        }).
                        error(function (data, status, headers, config) {
                            console.log('New Admin Error!');
                            console.debug(data);
                            deferred.reject({
                                status: status,
                                message: data
                            });
                        });

                    return deferred.promise;
            };

            this.deactivateAdmin = function(user){
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.deactivateUserUrl, {id: user.id, userType: user.userType})
                    .success(function (data, status, headers, config) {
                        console.log('Deactivate admin Success!');
                        console.debug(data);
                        var admin = _.find(self.admins, function(admin){ return admin._id === user.id; });
                        admin.isActive = false;
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Deactivate admin Error!');
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
