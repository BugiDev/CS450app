/*jshint unused: vars */
define([
    'angular'
], function (angular)/*invoke*/ {
    'use strict';

    return angular.module('cs450app.config', [])
        .constant('config', {
            apiBaseURL: 'http://localhost:8080',
            authUrl: '/user/auth',
            logoutUrl: '/user/logout',
            isAuthenticatedUrl: '/user/isAuthenticated',
            getUserProfileUrl: '/user/getUserProfile',
            setUserProfileUrl: '/user/setUserProfile',
            editUserProfileUrl: '/user/editUserProfile',
            createNewUserUrl: '/user/createNewUser',
            deactivateUserUrl: '/user/deactivateUser',
            getAllAdminsUrl: '/user/getAllAdmins',
            getAllProfessorsUrl: '/user/getAllProfessors',
            getAllStudentsUrl: '/user/getAllStudents'
        });
});
