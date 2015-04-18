/**
 * Created by bogdanbegovic on 4/13/15.
 */
require(['modules/panelModule/panel.module'], function (dashboardModule) {
    'use strict';

    dashboardModule
        .controller('topNavCtrl', function ($scope, userService, ngToast) {

            $scope.init = function () {
                $(window).bind('load resize', function () {
                    var topOffset = 50;
                    var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
                    if (width < 768) {
                        $('div.navbar-collapse').addClass('collapse');
                        topOffset = 100; // 2-row-menu
                    } else {
                        $('div.navbar-collapse').removeClass('collapse');
                    }

                    var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
                    height = height - topOffset;
                    if (height < 1) {
                        height = 1;
                    }
                    if (height > topOffset) {
                        $('#page-wrapper').css('min-height', (height) + 'px');
                    }
                });

                var url = window.location;
                var element = $('ul.nav a').filter(function () {
                    return this.href === url || url.href.indexOf(this.href) === 0;
                }).addClass('active').parent().parent().addClass('in').parent();
                if (element.is('li')) {
                    element.addClass('active');
                }
            };

            $scope.init();

            $scope.logout = function () {
                userService.logout();
            };

            $scope.$on('toast-error', function (event, args) {
                $scope.errorToast(args.message);
            });

            $scope.$on('toast-success', function (event, args) {
                $scope.successToast(args.message);
            });

            $scope.errorToast = function (text) {
                var aToast = ngToast.create({
                    className: 'danger',
                    content: text
                });
            };

            $scope.successToast = function (text) {
                var aToast = ngToast.create({
                    className: 'success',
                    content: text
                });
            };

        });
});
