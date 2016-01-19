'use strict';
(function (define, angular) {
    var setting = T5;
    //angular.element(document).ready(function () {
    //    angular.bootstrap("#giapha", [setting.name]);
    //});
    google.setOnLoadCallback(function () {
        angular.bootstrap("#giapha", [setting.name]);
    });
    google.load('visualization', '1', { packages: ['orgchart'] });
})(window.define, window.angular);