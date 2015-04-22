/**
 * Created by bogdanbegovic on 4/13/15.
 */
/*jshint unused: vars */
define([
    'angular'
], function (angular)/*invoke*/ {
    'use strict';

    return angular.module('cs450app.validators',[])
        .directive('emailValidator', function () {
            return {
                restrict:'AE',
                require:'ngModel',
                link:function($scope,elem,attrs,ngModel){
                    ngModel.$validators.email=function(modelValue,viewValue){
                        var value=modelValue || viewValue;
                        return /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/.test(value);
                    };
                }
            };
        })
        .directive('passwordValidator', function () {
            return {
                restrict:'AE',
                require:'ngModel',
                link:function($scope,elem,attrs,ngModel){
                    ngModel.$validators.password=function(modelValue,viewValue){
                        var value=modelValue || viewValue;
                        return /^\w{8,}$/.test(value);
                    };
                }
            };
        })
        .directive('passwordRepeatValidator', function () {
            return {
                restrict:'AE',
                require:'ngModel',
                link:function($scope,elem,attrs,ngModel){
                    ngModel.$validators.passwordRepeat=function(modelValue,viewValue){
                        var value=modelValue || viewValue;
                        if($scope.password === value){
                            return true;
                        }else{
                            return false;
                        }
                    };
                }
            };
        });
});
