(function (define, angular) {
    var setting = nift_app_setting;
    window.angular.module(setting.name)
        .config(configure)
        .config(exceptionConfig);
    exceptionConfig.$inject = ['$provide'];
    extendExceptionHandler.$inject = ['$delegate', 'toastr'];
    configure.$inject = ['$stateProvider', '$urlRouterProvider', 'toastr', setting.routes];
    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }
    function extendExceptionHandler($delegate, toastr) {
        return function (exception, cause) {
            $delegate(exception, cause);
            var errorData = {
                exception: exception,
                cause: cause
            };
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             */
            toastr.error(exception.message, errorData);
        };
    }
    function configure($stateProvider, $urlRouterProvider, toastr, routes) {

        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';

        $stateProvider
            .state(routes.app, {
                url: '/',
                views: {
                    'header': {
                        templateUrl: setting.partial.header(setting.version),
                        controller: setting.controller.headerasvm()
                    },
                    'content': {
                        templateUrl: setting.partial.start(setting.version),
                        controller: setting.controller.startasvm()
                    }
                }
            })
            .state(routes.app + '.' + routes.main, {
                url: routes.main,
                views: {
                    'header@': {
                        templateUrl: setting.partial.header(setting.version),
                        controller: setting.controller.headerasvm()
                    },
                    'content@': {
                        templateUrl: setting.partial.main(setting.version),
                        controller: setting.controller.mainasvm()
                    }
                }

            });
        //$urlRouterProvider.otherwise('/' + routes.start);
        $urlRouterProvider.otherwise('/');
    };
})(window.define, window.angular);