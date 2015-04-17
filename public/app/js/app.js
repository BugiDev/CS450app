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
            'ncy-angular-breadcrumb',
            'ImageCropper',

            /*angJSDeps*/
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngSanitize',
            'ui.router',
            'ngAnimate',
            'ngTouch'

        ])
        .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider) {

            //TODO promeniti za produkciju Prefix
            localStorageServiceProvider
                .setPrefix('')
                .setStorageType('localStorage')
                .setNotify(true, true);

            $httpProvider.interceptors.push('APIInterceptor');

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
                    },
                    ncyBreadcrumb: {
                        skip: true // Never display this state in breadcrumb.
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
                    },
                    ncyBreadcrumb: {
                        skip: true // Never display this state in breadcrumb.
                    }
                }).state('panel.content.dashboard', {
                    url: '^/dashboard',
                    views: {
                        'panel-content': {
                            controller: 'dashboardCtrl',
                            templateUrl: 'js/panelModule/views/dashboard.html'
                        }
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard' // Never display this state in breadcrumb.
                    }
                }).state('panel.content.myProfile', {
                    url: '^/myProfile',
                    views: {
                        'panel-content': {
                            controller: 'myProfileCtrl',
                            templateUrl: 'js/panelModule/views/myProfile.html'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label:'{{user.firstName}} {{user.lastName}}'
                    }
                }).state('panel.content.addNewAdmin', {
                    url: '^/addNewAdmin',
                    views: {
                        'panel-content': {
                            controller: 'addNewAdminCtrl',
                            templateUrl: 'js/panelModule/views/addNewAdmin.html'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label:'Add New Admin'
                    }
                }).state('panel.content.addNewProfessor', {
                    url: '^/addNewProfessor',
                    views: {
                        'panel-content': {
                            controller: 'addNewProfessorCtrl',
                            templateUrl: 'js/panelModule/views/addNewProfessor.html'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label:'Add New Professor'
                    }
                }).state('panel.content.addNewStudent', {
                    url: '^/addNewStudent',
                    views: {
                        'panel-content': {
                            controller: 'addNewStudentCtrl',
                            templateUrl: 'js/panelModule/views/addNewStudent.html'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label:'Add New Student'
                    }
                }).state('panel.content.allAdmins', {
                    url: '^/allAdmins',
                    views: {
                        'panel-content': {
                            controller: 'allAdminsCtrl',
                            templateUrl: 'js/panelModule/views/allAdmins.html'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label:'All Admins'
                    }
                }).state('panel.content.allProfessors', {
                    url: '^/allProfessors',
                    views: {
                        'panel-content': {
                            controller: 'allProfessorsCtrl',
                            templateUrl: 'js/panelModule/views/allProfessors.html'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label:'All Professors'
                    }
                }).state('panel.content.allStudents', {
                    url: '^/allStudents',
                    views: {
                        'panel-content': {
                            controller: 'allStudentsCtrl',
                            templateUrl: 'js/panelModule/views/allStudents.html'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label:'All Students'
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

                userService.isAuthenticated().then(
                    function(data){
                        if(!data){
                            $location.path('/login');
                        }
/*                        if (!routeClean($location.url())) {
                            // redirect back to login
                            $location.path('/login');
                        }*/
                    }, function(data){
                        $location.path('/login');
                    }
                );
            });
        }).factory('APIInterceptor', function($rootScope, $location, $q) {
            return {
                response: function (response) { return response; },
                responseError: function(response) {
                    if (response.status === 401) {
                        if($location.path() !== '/login'){
                            $location.path('/login');
                        }
                    }
                    return $q.reject(response);
                }
            };
        });
});
