/*jshint unused: vars */
define([
    'angular',
    'underscoreMixin',
    'angular-ui-router',
    'validators/validators',
    'authModule/auth.module',
    'panelModule/panel.module',
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
            'cs450app.panel',
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
                .state('panel', {
                    views: {
                        'master': {
                            templateUrl: 'js/panelModule/views/panel.html'
                        }
                    }
                }).state('panel.content', {
                    views: {
                        'sidebar-nav': {
                            controller: 'sidebarNavCtrl',
                            templateUrl: 'js/panelModule/views/sidebarNav.html'
                        },
                        'top-nav': {
                            controller: 'topNavCtrl',
                            templateUrl: 'js/panelModule/views/topNav.html'
                        },
                        'content-holder': {
                            templateUrl: 'js/panelModule/views/content.html'
                        }
                    }
                }).state('panel.content.dashboard', {
                    url: '^/dashboard',
                    views: {
                        'panel-content': {
                            controller: 'dashboardCtrl',
                            templateUrl: 'js/panelModule/views/dashboard.html'
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
