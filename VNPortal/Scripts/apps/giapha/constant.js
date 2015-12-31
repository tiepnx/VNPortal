'use strict';
(function (define, angular) {
    var setting = T5;
    window.angular.module(setting.name, setting.dependencies)
        .constant('toastr', toastr)
        .constant(setting.constants.api, {
            GetActivedYears: setting.apiUrl + 'GetActivedYears',
            getAffiliates: setting.apiUrl + 'GetAffiliates',
            createSurvey: setting.apiUrl + + 'CreateSurvey',
            getSurveyStatistics: setting.apiUrl + 'GetHealthCenterSurveyStatus',
            checkHealthCenterPermission: setting.apiUrl + 'CheckPermissionAtHC',
            updateSurveyType: setting.apiUrl + 'UpdateSurveyType',
        })
        .constant(setting.routes, {
            app: 'app',
            start: '/',
            main: 'main',
        });
})(window.define, window.angular);