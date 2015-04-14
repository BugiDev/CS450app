/*jshint unused: vars */
define([
    'angular',
    'underscoreMixin',
    'angular-ui-router',
    'validators/validators',
    'authModule/auth.module',
    'dashboardModule/dashboard.module',
    'userMgmtModule/userMgmt.module',
    'constants/config'

], function (angular, _)/*invoke*/ {
    'use strict';

    /**
     * @ngdoc overview
     * @name obuciSeApp
     * @description
     * # obuciSeApp
     *
     * Main module of the application.
     */
    return angular
        .module('cs450app',
        [
            'cs450app.auth',
            'cs450app.validators',
            'cs450app.config',
            'cs450app.userMgmt',
            'cs450app.dashboard',
            'LocalStorageModule',

            /*angJSDeps*/
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngSanitize',
            'ui.router',
            'ngAnimate',
            'ngTouch'

        ])
        .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

            //TODO promeniti za produkciju Prefix
            localStorageServiceProvider
                .setPrefix('')
                .setStorageType('localStorage')
                .setNotify(true, true);

            $stateProvider
                .state('auth', {
                    url: '^/login',
                    views: {
                        'master': {
                            controller: 'authCtrl',
                            templateUrl: 'js/authModule/views/auth.html'
                        }
                    }
                })
                .state('dashboard', {
                    views: {
                        'master': {
                            templateUrl: 'js/dashboardModule/views/dashboard.html'
                        }
                    }
                }).state('dashboard.sidebarNav', {
                    views: {
                        'sidebar-nav': {
                            controller: 'dashboard.sidebarNav.ctrl',
                            templateUrl: 'js/dashboardModule/views/sidebarNav.html'
                        }
                    }
                }).state('dashboard.topNav', {
                    views: {
                        'top-nav': {
                            controller: 'dashboard.topNav.ctrl',
                            templateUrl: 'js/dashboardModule/views/topNav.html'
                        }
                    }
                }).state('dashboard.mainContent', {
                    url: '^/dashboard',
                    views: {
                        'dashboard-content': {
                            controller: 'dashboard.mainContent.ctrl',
                            templateUrl: 'js/dashboardModule/views/mainContent.html'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/login');
        })
        .run(function ($rootScope, $location, userService) {
            var routesThatDontRequireAuth = ['/login'];

            // check if current location matches route
            var routeClean = function (route) {
                return _.find(routesThatDontRequireAuth,
                    function (noAuthRoute) {
                        return _.startsWith(route, noAuthRoute);
                    });
            };

            $rootScope.$on('$stateChangeStart', function (event, next, current) {
                // if route requires auth and user is not logged in
                if (!routeClean($location.url()) && !userService.isAuthenticated()) {
                    // redirect back to login
                    $location.path('/login');
                }
            });
        });
});
