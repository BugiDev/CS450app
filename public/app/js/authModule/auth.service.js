/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['angular', 'authModule/auth.module'], function (angular, authModule) {
    'use strict';

    authModule
        .service('authService', function ($http, config, $q, $location) {

            this.authenticate = function(email, password){
                var deferred = $q.defer();
                $http.post(config.apiBaseURL + config.authUrl, {email: email, password: password})
                    .success(function (data, status, headers, config) {
                        console.log('Auth Success!');
                        console.debug(data);
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Auth Error!');
                        console.debug(data);
                        deferred.reject({
                            status: status,
                            message: data
                        });
                    });

                return deferred.promise;
            };

            this.logout = function(){
                var deferred = $q.defer();
                $http.get(config.apiBaseURL + config.logoutUrl)
                    .success(function (data, status, headers, config) {
                        console.log('Logout Success!');
                        deferred.resolve();
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Logout Error!');
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

        });
});
