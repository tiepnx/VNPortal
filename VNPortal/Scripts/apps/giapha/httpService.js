(function (define, angular) {
    /* http://www.tutorialspoint.com/angularjs/angularjs_services.htm */
    var setting = nift_app_setting;
    window.angular.module(setting.name)
        .service(setting.service.httpService(), httpServiceFn);
    httpServiceFn.$inject = ['$http', '$q'];
    function httpServiceFn($http, $q) {
        return {
            getData: callGet,
            postData: callPost
        };
        function callGet(url) {
            // Create the deffered object
            var deferred = $q.defer();
            if (url.search(/\?/i) > 0) {
                url = url + "&v=" + (new Date()).getTime();
            } else {
                url = url + "?v=" + (new Date()).getTime();
            }
            var request = $http({
                url: url,
                method: "GET",
                contentType: "application/json;odata=verbose",
                headers: { "accept": "application/json;odata=verbose" }
            });

            request.then(
                function (resp) {
                    deferred.resolve(resp.data);
                },
                function (resp) {
                    deferred.reject(resp);
                }
            );
            return deferred.promise;
        }
        function callPost(url, dataPost) {
            var deferred = $q.defer();
            var request = $http({
                url: url,
                method: "POST",
                data: JSON.stringify(dataPost),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            return (request.then(handleSuccess, handleError));

            // I transform the successful response, unwrapping the application data
            function handleSuccess(response) {
                return (response.data);
            }

            function handleError(response) {
                if (!angular.isObject(response.data) || !response.data.message) {
                    return ($q.reject("An unknown error occurred."));
                }
                // Otherwise, use expected error message.
                return ($q.reject(response.data.message));
            }
        }
        
    }
})(window.define, window.angular);