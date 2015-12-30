(function (define, angular) {
    var setting = nift_app_setting;
    window.angular.module(setting.name, setting.dependencies)
        .constant('toastr', toastr)
        .constant(setting.constant, {
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