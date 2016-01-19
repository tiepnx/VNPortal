'use strict';
(function (define, angular) {
    var setting = T5;
    angular.module(setting.name)
        .controller(setting.controllers.header, headerCtr)
        .controller(setting.controllers.start, startCtr)
        .controller(setting.controllers.main, mainCtr);
    headerCtr.$inject = ['$sce', '$state', '$timeout', 'logger', setting.factorys.global];
    startCtr.$inject = ['$scope', '$state', '$timeout', 'logger', setting.routes, setting.factorys.global, setting.factorys.start];
    mainCtr.$inject = ['$scope', '$sce', '$state', '$timeout', 'logger', setting.routes, setting.factorys.global];
    function headerCtr($sce, $state, $timeout, logger, globalService) {
        var vm = this;
        //vm.globalData = globalService.data;
        //vm.fn = {
        //    renderBreadcrumbs: renderBreadcrumbs,
        //}
        //function fnInit() {
            
        //}
        //function renderBreadcrumbs() {
        //    return $sce.trustAsHtml(globalService.data.headerNavText);
        //}
    }
    function startCtr($scope, $state, $timeout, logger, routes, global) {
        var vm = this;
     
        vm.fn = {
            fnInit: fnInit,
            fnGetAffiliates: fnGetAffiliates,
            fnGo: fnGo
        }
        /*function*/
        function fnInit() {
            globalService.dialog.showWaiting();
            globalService.localStore.set(setting.appKey.year, null);
            globalService.localStore.set(setting.appKey.affiliate, null);
            startService.getYear().then(function (results) {
                if (results != null && results.length > 0) {
                    globalService.data.headerNavText = '<a href="#/">Start</a>';
                    vm.data.selectedYear = results[0];
                    globalService.data.years = results;
                    vm.globalData = globalService.data;
                    fnGetAffiliates();
                }
            }, function (err) {
                logger.error(err.statusText + ' (' + err.config.url + ')');
                globalService.dialog.hideWaiting();
            });
        }
        function fnGetAffiliates() {
            globalService.dialog.showWaiting();
            startService.getAffiliates(vm.data.selectedYear.yearID).then(
                function (resp) {
                    if (resp == null || resp.length == 0) {
                        logger.error(nift_app_message.noAffiliate);
                    }
                    else {
                        globalService.data = $.extend(globalService.data, { affiliates: resp });
                        vm.data.selectedAffiliate = globalService.data.affiliates[0];
                        /*globalService.data = $.extend(globalService.data, { selectedAffiliate: globalService.data.affiliates[0] });*/
                    }

                    $timeout(function () {
                        jQuery('.ddlAED').selectpicker({
                            style: nift_style_setting.dropdown
                        }).selectpicker('refresh');
                        globalService.dialog.hideWaiting();
                        vm.isReady = true;
                    });
                },
                function (err) {
                    globalService.dialog.hideWaiting();
                    //globalService.dialog.showError();
                    logger.error(err.statusText + ' (' + err.config.url + ')');
                }
            );
        }
        function fnGo() {
            globalService.localStore.set(setting.appKey.year, vm.data.selectedYear);
            globalService.localStore.set(setting.appKey.affiliate, vm.data.selectedAffiliate);
            globalService.data = $.extend(globalService.data, { selectedAffiliate: vm.data.selectedAffiliate });
            globalService.data = $.extend(globalService.data, { selectedYear: vm.data.selectedYear });
            $state.go(routes.app + '.' + routes.main);
        }
        /****************************************************************************************/
    }
    function mainCtr($scope, $sce, $state, $timeout, logger, routes, globalService) {
        var vm = this;
        vm.data = {
            arr:[
                     ['1', ''],
                     ['1.1', '1'],
                     ['1.2', '1'],
                     ['1.1.1', '1.1'],
                     ['1.1.2', '1.1'],
                     ['1.1.3', '1.1'],
                     ['1.2.1', '1.2'],
                     ['1.2.2', '1.2'],
                     ['1.1.1.1', '1.1.1'],
                     ['1.1.1.2', '1.1.1'],
                     ['1.1.3.1', '1.1.3'],
                     ['1.2.2.1', '1.2.2'],
                     ['1.2.2.2', '1.2.2']
            ],
            message:''
        };
        vm.fn = {
            fnRenderHTML: renderHTML,
            fnExpandCollapse: fnExpandCollapse,
            show: fnShow,
            init: fnInit,
        }
 
        function renderHTML(value) {
            return $sce.trustAsHtml(value);
        }
        function fnExpandCollapse(event) {
            var parentTag = angular.element(event.target).closest('div.ppfa-selection-header');
            $timeout(function () {
                expandCollapse(parentTag.next());
            });            
        }
        function expandCollapse(element) {
            if ($(element).hasClass('collapsed')) {
                $(element).slideUp('fast', function () {
                    $(this).removeClass('collapsed');
                    $(this).prev().children().last().children().removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                });
            }
            else {
                $(element).slideDown('fast', function () {
                    $(this).addClass('collapsed');
                    $(this).prev().children().last().children().removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                });
            }
        }
        function fnInit() {
            vm.data.message = "start";
        }
        function fnShow(value) {
            console.log(value);
        }
    }
})(window.define, window.angular);