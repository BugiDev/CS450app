/*jshint unused: vars */
define([
    'angular'
], function (angular)/*invoke*/ {
    'use strict';

    return angular.module('cs450app.roles', [])
        .constant('roles', {
            admin: 'ADMIN',
            professor: 'PROFESSOR',
            student: 'STUDENT'
        });
});
