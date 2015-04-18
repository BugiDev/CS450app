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

            getAdminByIdUrl: '/admin/getAdminByID/',
            setAdminProfileUrl: '/admin/setAdminProfile',
            editAdminProfileUrl: '/admin/editAdminProfile',
            createNewAdminUrl: '/admin/createNewAdmin',
            deactivateAdminUrl: '/admin/deactivateAdmin',
            getAllAdminsUrl: '/admin/getAllAdmins',

            getProfessorByIdUrl: '/professor/getProfessorByID/',
            setProfessorProfileUrl: '/professor/setProfessorProfile',
            editProfessorProfileUrl: '/professor/editProfessorProfile',
            createNewProfessorUrl: '/professor/createNewProfessor',
            deactivateProfessorUrl: '/professor/deactivateProfessor',
            getAllProfessorsUrl: '/professor/getAllProfessors',

            getStudentByIdUrl: '/student/getStudentByID/',
            setStudentProfileUrl: '/student/setStudentProfile',
            editStudentProfileUrl: '/student/editStudentProfile',
            createNewStudentUrl: '/student/createNewStudent',
            deactivateStudentUrl: '/student/deactivateStudent',
            getAllStudentsUrl: '/student/getAllStudents'
        });
});
