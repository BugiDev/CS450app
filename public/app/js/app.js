/*jshint unused: vars */
define([
    'angular',
    'underscoreMixin',
    'angular-ui-router',
    'validators/validators',
    'modules/authModule/auth.module',
    'modules/panelModule/panel.module',
    'modules/modalDialogModule/modal.module',
    'modules/studentModule/student.module',
    'modules/professorModule/professor.module',
    'modules/adminModule/admin.module',
    'modules/attendanceModule/attendance.module',
    'modules/userMgmtModule/userMgmt.module',
    'constants/config',
    'constants/roles'

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
            'cs450app.roles',
            'cs450app.userMgmt',
            'cs450app.panel',
            'cs450app.modalModule',
            'cs450app.student',
            'cs450app.professor',
            'cs450app.admin',
            'cs450app.attendance',
            'LocalStorageModule',
            'ncy-angular-breadcrumb',
            'ImageCropper',
            'ngToast',
            'angularModalService',
            'permission',

            /*angJSDeps*/
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngSanitize',
            'ui.router',
            'ngAnimate',
            'ngTouch'

        ])
        .config(function (localStorageServiceProvider, $httpProvider, $urlRouterProvider, $stateProvider) {

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
                            templateUrl: 'js/modules/authModule/views/auth.html'
                        }
                    }
                })
                .state('panel', {
                    views: {
                        'master': {
                            templateUrl: 'js/modules/panelModule/views/panel.html'
                        }
                    },
                    ncyBreadcrumb: {
                        skip: true // Never display this state in breadcrumb.
                    }
                }).state('panel.content', {
                    views: {
                        'sidebar-nav': {
                            controller: 'sidebarNavCtrl',
                            templateUrl: 'js/modules/panelModule/views/sidebarNav.html'
                        },
                        'top-nav': {
                            controller: 'topNavCtrl',
                            templateUrl: 'js/modules/panelModule/views/topNav.html'
                        },
                        'content-holder': {
                            templateUrl: 'js/modules/panelModule/views/content.html'
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
                            templateUrl: 'js/modules/panelModule/views/dashboard.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['student', 'anonymous'],
                            redirectTo: 'auth'
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
                            templateUrl: 'js/modules/panelModule/views/myProfile.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['anonymous'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: '{{user.firstName}} {{user.lastName}}'
                    }
                }).state('panel.content.addNewAdmin', {
                    url: '^/addNewAdmin',
                    views: {
                        'panel-content': {
                            controller: 'addNewAdminCtrl',
                            templateUrl: 'js/modules/adminModule/views/addNewAdmin.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'Add New Admin'
                    }
                }).state('panel.content.addNewProfessor', {
                    url: '^/addNewProfessor',
                    views: {
                        'panel-content': {
                            controller: 'addNewProfessorCtrl',
                            templateUrl: 'js/modules/professorModule/views/addNewProfessor.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'Add New Professor'
                    }
                }).state('panel.content.addNewStudent', {
                    url: '^/addNewStudent',
                    views: {
                        'panel-content': {
                            controller: 'addNewStudentCtrl',
                            templateUrl: 'js/modules/studentModule/views/addNewStudent.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'Add New Student'
                    }
                }).state('panel.content.allAdmins', {
                    url: '^/allAdmins',
                    views: {
                        'panel-content': {
                            controller: 'allAdminsCtrl',
                            templateUrl: 'js/modules/adminModule/views/allAdmins.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'All Admins'
                    }
                }).state('panel.content.allProfessors', {
                    url: '^/allProfessors',
                    views: {
                        'panel-content': {
                            controller: 'allProfessorsCtrl',
                            templateUrl: 'js/modules/professorModule/views/allProfessors.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'All Professors'
                    }
                }).state('panel.content.allStudents', {
                    url: '^/allStudents',
                    views: {
                        'panel-content': {
                            controller: 'allStudentsCtrl',
                            templateUrl: 'js/modules/studentModule/views/allStudents.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['student', 'anonymous'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'All Students'
                    }
                }).state('panel.content.editAdmin', {
                    url: '^/editAdmin/:id',
                    views: {
                        'panel-content': {
                            controller: 'editAdminCtrl',
                            templateUrl: 'js/modules/adminModule/views/editAdmin.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'Edit Admin'
                    }
                }).state('panel.content.editProfessor', {
                    url: '^/editProfessor/:id',
                    views: {
                        'panel-content': {
                            controller: 'editProfessorCtrl',
                            templateUrl: 'js/modules/professorModule/views/editProfessor.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'Edit Professor'
                    }
                }).state('panel.content.editStudent', {
                    url: '^/editStudent/:id',
                    views: {
                        'panel-content': {
                            controller: 'editStudentCtrl',
                            templateUrl: 'js/modules/studentModule/views/editStudent.html'
                        }
                    },
                    data: {
                        permissions: {
                            only: ['admin'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'Edit Student'
                    }
                }).state('panel.content.editProfile', {
                    url: '^/editProfile',
                    views: {
                        'panel-content': {
                            controller: 'editProfileCtrl',
                            templateUrl: 'js/modules/panelModule/views/editProfile.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['anonymous'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.myProfile',
                        label: 'Edit Profile'
                    }
                }).state('panel.content.allLectures', {
                    url: '^/allLectures',
                    views: {
                        'panel-content': {
                            controller: 'allLecturesCtrl',
                            templateUrl: 'js/modules/attendanceModule/views/allLectures.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['student', 'anonymous'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'All Lectures'
                    }
                }).state('panel.content.editLecture', {
                    url: '^/editLecture/:id',
                    views: {
                        'panel-content': {
                            controller: 'editLectureCtrl',
                            templateUrl: 'js/modules/attendanceModule/views/editLecture.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['student', 'anonymous'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.allLectures',
                        label: 'Edit Lecture'
                    }
                }).state('panel.content.allLabs', {
                    url: '^/allLabs',
                    views: {
                        'panel-content': {
                            controller: 'allLabsCtrl',
                            templateUrl: 'js/modules/attendanceModule/views/allLabs.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['student', 'anonymous'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.dashboard',
                        label: 'All Labs'
                    }
                }).state('panel.content.editLab', {
                    url: '^/editLab/:id',
                    views: {
                        'panel-content': {
                            controller: 'editLabCtrl',
                            templateUrl: 'js/modules/attendanceModule/views/editLab.html'
                        }
                    },
                    data: {
                        permissions: {
                            except: ['student', 'anonymous'],
                            redirectTo: 'panel.content.dashboard'
                        }
                    },
                    ncyBreadcrumb: {
                        parent: 'panel.content.allLabs',
                        label: 'Edit Lab'
                    }
                });

            $urlRouterProvider.otherwise('/login');

        })
        .run(function ($rootScope, $location, userService, roles, Permission, $q) {

            Permission.defineRole('anonymous', function (stateParams) {
                var deferred = $q.defer();
                userService.isAuthenticated().then(function (data) {
                    if(data){
                        deferred.reject();
                    }else{
                        deferred.resolve();
                    }
                }, function(err){
                    deferred.reject();
                });
                return deferred.promise;
            });

            Permission.defineRole('admin', function (stateParams) {
                var deferred = $q.defer();
                userService.isAuthenticated().then(function (data) {
                    if(data &&  userService.user.userType === roles.admin){
                        deferred.resolve();
                    }else{
                        deferred.reject();
                    }
                }, function(err){
                    deferred.reject();
                });
                return deferred.promise;
            });

            Permission.defineRole('professor', function (stateParams) {
                var deferred = $q.defer();
                userService.isAuthenticated().then(function (data) {
                    if(data && userService.user.userType === roles.professor){
                        deferred.resolve();
                    }else{
                        deferred.reject();
                    }
                }, function(err){
                    deferred.reject();
                });
                return deferred.promise;
            });

            Permission.defineRole('student', function (stateParams) {
                var deferred = $q.defer();
                userService.isAuthenticated().then(function (data) {
                    if(data && userService.user.userType === roles.student){
                        deferred.resolve();
                    }else{
                        deferred.reject();
                    }
                }, function(err){
                    deferred.reject();
                });
                return deferred.promise;
            });

            /*            $rootScope.$on('$stateChangeStart', function (event, next, current) {
             // if route requires auth and user is not logged in

             userService.isAuthenticated().then(
             function (data) {
             console.log('Auth check');
             console.debug(data);
             if (!data) {
             $location.path('/login');
             }
             */
            /*                        if (!routeClean($location.url())) {
             // redirect back to login
             $location.path('/login');
             }*/
            /*
             }, function (data) {
             console.log('Auth check error');
             console.debug(data);
             $location.path('/login');
             }
             );
             });*/
        }).factory('APIInterceptor', function ($rootScope, $location, $q) {
            return {
                response: function (response) {
                    return response;
                },
                responseError: function (response) {
                    if (response.status === 401) {
                        if ($location.path() !== '/login') {
                            $location.path('/login');
                        }
                    }
                    return $q.reject(response);
                }
            };
        });
});
