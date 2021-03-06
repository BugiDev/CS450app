/*jshint unused: vars */
require.config({
    paths: {
        angular: '../bower_components/angular/angular',
        'angular-animate': '../bower_components/angular-animate/angular-animate',
        'angular-cookies': '../bower_components/angular-cookies/angular-cookies',
        'angular-messages': '../bower_components/angular-messages/angular-messages',
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        'angular-resource': '../bower_components/angular-resource/angular-resource',
        'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
        'angular-scenario': '../bower_components/angular-scenario/angular-scenario',
        'angular-touch': '../bower_components/angular-touch/angular-touch',
        'angular-breadcrumb': '../bower_components/angular-breadcrumb/dist/angular-breadcrumb.min',
        'angular-image-crop': '../bower_components/angular-image-crop/image-crop',
        'angular-modal-service': '../bower_components/angular-modal-service/dst/angular-modal-service.min',
        'angular-permission': '../bower_components/angular-permission/dist/angular-permission',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        'angular-localStorage': '../bower_components/angular-local-storage/dist/angular-local-storage',
        'underscore': '../bower_components/underscore/underscore-min',
        'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
        'underscoreMixin': 'util/underscoreMixin'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-cookies': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-resource': ['angular'],
        'angular-animate': ['angular'],
        'angular-touch': ['angular'],
        'angular-messages': ['angular'],
        'angular-ui-router': ['angular'],
        'angular-localStorage': ['angular'],
        'angular-breadcrumb': ['angular'],
        'angular-image-crop': ['angular'],
        'angular-modal-service': ['angular'],
        'angular-permission': ['angular'],
        'angular-bootstrap': ['angular'],
        'angular-mocks': {
            deps: [
                'angular'
            ],
            exports: 'angular.mock'
        },
        'underscore': {
            exports: '_'
        },
        'underscore.string': {
            deps: ['underscore']
        }
    },
    priority: [
        'angular'
    ],
    packages: []
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
    'angular',
    'app',
    'angular-cookies',
    'angular-sanitize',
    'angular-resource',
    'angular-animate',
    'angular-touch',
    'angular-messages',
    'angular-ui-router',
    'angular-localStorage',
    'angular-breadcrumb',
    'angular-image-crop',
    'angular-modal-service',
    'angular-permission',
    'angular-bootstrap',
    'bootstrap'
], function (angular, app, ngCookies, ngSanitize, ngResource, ngAnimate, ngTouch, ngMessages, uiRouter, localStorage) {
    'use strict';
    /* jshint ignore:start */
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    /* jshint ignore:end */
    angular.element().ready(function () {
        angular.resumeBootstrap([app.name]);
    });
});
