'use strict';
(function (define, angular) {
    var setting = T5;
    window.angular.module(setting.name)
        .factory('logger', logger)
        .factory('exception', exception)
        .factory(setting.factorys.global, globalServiceFn)
        .factory(setting.factorys.start, startServiceFn);
    logger.$inject = ['$log', 'toastr'];
    exception.$inject = ['logger'];
    startServiceFn.$inject = ['$http', '$q', setting.services.httpService, setting.constants.api];
    
    function logger($log, toastr) {
        var service = {
            showToasts: true,
            error: error,
            info: info,
            success: success,
            warning: warning,
            //strainght to console; bypass toastr
            log: $log.log
        }
        return service;

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
        }
        function info(message) {
            toastr.info(message, title);
            $log.info('Info: ' + message);
        }
        function success(message, data, title) {
            toastr.success(message, title);
            $log.success('Success: ' + message);
        }
        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warning('warning: ' + message);
        }
    }
    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function (reason) {
                logger.error(message, reason);
            };
        }
    }
    function globalServiceFn() {
        var global = this;
        global.data = {
            headerNavText: null,
            years: null,
            selectedYear: null,
            selectedAffiliate: null,
            surveyModes: [
                { key: 13, value: 'HCA' },
                { key: 14, value: 'HCA Lite' }
            ],
        }
        global.dialog = {
            setLocalStorage: setLocalStorage,
            getLocalStore:getLocalStore,
            showWaiting: showWaitingDialog,
            hideWaiting: hideWaitingDialog,
        }
        global.localStore = {
            set: setLocalStorage,
            get: getLocalStore
        }
        function setLocalStorage(key, value) {
            localStorage.setItem(key, null ? null : JSON.stringify(value));
        }
        function getLocalStore(key) {
            return JSON.parse(localStorage.getItem(key));
        }
        function showWaitingDialog() {
            $('#waiting-dialog').show();
        }
        function hideWaitingDialog() {
            $('#waiting-dialog').hide();
        }
        return global;
    }
    function startServiceFn($http, $q, httpService, constant) {
        return {
            getYear: getYear,
            getAffiliates: getAffiliates,
            createSurvey: createSurvey
        }
        function getYear() {
            return httpService.getData(constant.GetActivedYears);
        }

        function getAffiliates(yearID) {
            return httpService.getData(constant.getAffiliates + '/' + yearID);
        }

        function createSurvey(affID, yearID) {
            var data = { affID: affID, yearID: yearID };
            return httpService.postData(constant.createSurvey, data);
        }
    }
})(window.define, window.angular);
