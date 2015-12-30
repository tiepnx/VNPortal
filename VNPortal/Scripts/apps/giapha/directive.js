﻿(function (define, angular) {
    var setting = nift_app_setting;
    window.angular.module(setting.name)
        .directive(setting.directive.dtPicker, dtPickerDr);
    dtPickerDr.$inject = ['$timeout', 'logger', setting.service.global()];
    
    function dtPickerDr($timeout, logger) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var option = {
                    collapse: false,
                    pickTime: false,
                    useCurrent: false,
                    language: 'en',
                    icons: {
                        date: "glyphicon glyphicon-th-large"
                    }
                }               
                $timeout(function () {
                    jQuery(element).datetimepicker(option).on("dp.change", function (event) {
                        var valuePicker = $(this).data().date;
                        var valueInput = $(this).children().first().val();
                        var value = valueInput;
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(value);
                        });
                    });
                });
            }
        };
    }    
})(window.define, window.angular);