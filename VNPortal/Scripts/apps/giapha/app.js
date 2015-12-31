'use strict';
(function (define, angular) {
    var setting = T5;
    angular.element(document).ready(function () {
        window.angular.bootstrap("#giapha", [setting.name]);
    });
})(window.define, window.angular);