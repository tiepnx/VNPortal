'use strict';
(function (define, angular) {
    var setting = T5;
    window.angular.module(setting.name)
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
        vm.data = {};
        vm.fn = {
            fnRenderHTML: renderHTML,
            fnExpandCollapse: fnExpandCollapse,
            fnInit: fnInit,
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
            globalService.dialog.showWaiting();
            try {
                if (globalService.data.selectedYear == null || globalService.data.selectedYear === {}) {
                    var year = globalService.localStore.get(setting.appKey.year);
                    var affiliate = globalService.localStore.get(setting.appKey.affiliate);
                    if (year === null || year === {}) {
                        $state.go(routes.app);
                    } else {
                        globalService.data.selectedYear = year;
                        globalService.data.selectedAffiliate = affiliate;
                    }
                }
                vm.data = $.extend(vm.data, { boardChair: 'First Name Last Name' });
                vm.data = $.extend(vm.data, { presidentCEO: 'First Name Last Name' });
                vm.data = $.extend(vm.data, { leadSurveyors: '1. First Name Last Name\n 2. First Name Last Name' });
                vm.data = $.extend(vm.data, { medicalDirector: 'First Name Last Name, (Credentials)' });
                vm.data = $.extend(vm.data, { offSiteTeam: 'Karen Ito, Board/Administration/Finance\n' 
                    + 'Eileen Dick, Risk and Quality Management'
                    + 'Eileen Dick, Risk and Quality Management\n'
                    + 'Charlie Earle, IT and HIPAA\n'
                    + 'John McHugh, Medical Director Evaluation\n'
                    + 'Anne Scheuer, Medical Manual Review\n'
                    + 'Margaret Harris, Revenue Cycle\n'
                    + 'Nina Lauro, Ancillary Compliance\n'
                    + 'Jordan Inselmann, Diversity\n'
                    + 'Sonya Norsworthy, Education\n'
                    + 'Len Dodson, Finance\n'
                    + 'Public Affairs'
                });
                vm.data = $.extend(vm.data, { onSiteTeam: 'First Name Last Name, ROLE\n'
                    + 'First Name Last Name, ROLE\n'
                    + 'First Name Last Name, ROLE\n'
                    + 'First Name Last Name, ROLE\n'
                    + 'First Name Last Name, ROLE' });
                vm.data = $.extend(vm.data, { dropdown: [{ value: '1', name: 'Yes' }, { value: '2', name: 'No' }, { value: '3', name: 'N/A' }] });
                vm.data = $.extend(vm.data, { hcs: [{ visited: '1', reviewed: '2' }, { visited: '2', reviewed: '3' }, { visited: '1', reviewed: '3'}] });
                vm.data = $.extend(vm.data, {
                    coreServices: [
                        { id: 1, description: 'Well Woman Exam', available: null, reviewed: null, order: 1 },
                        { id: 2, description: 'Basic Breast Services – Level I', available: null, reviewed: null, order: 2 },
                        { id: 3, description: 'All STI Counseling, Testing & Treatment', available: null, reviewed: null, order: 3 },
                        { id: 4, description: 'HPV Vaccine', available: null, reviewed: null, order: 4 },
                        { id: 5, description: 'Pregnancy Test & Options Counseling', available: null, reviewed: null, order: 5 },
                        { id: 6, description: 'In-Clinic Abortion 1st trimester', available: null, reviewed: null, order: 6 },
                        { id: 7, description: 'Abortion Pill', available: null, reviewed: null, order: 7 },
                        { id: 8, description: 'All periodic health screening & preventive services', available: null, reviewed: null, order: 8 },
                        { id: 9, description: 'Level I GYN – Basic Gynecological Services', available: null, reviewed: null, order: 9 },
                        { id: 10, description: 'Point-of-Service Rapid HIV Testing', available: null, reviewed: null, order: 10 },
                        { id: 11, description: 'Combined & Progestin-only Oral Contraceptives', isGroup: true, order: 11 },
                        { id: 12, description: '&#160;&#160;&#160;&#160;In-Clinic Abortion 1st trimester', available: null, reviewed: null, order: 12 },
                        { id: 13, description: '&#160;&#160;&#160;&#160;Emergency Contraception', available: null, reviewed: null, order: 13 },
                        { id: 14, description: '&#160;&#160;&#160;&#160;Male Condom', available: null, reviewed: null, order: 14 },
                        { id: 15, description: '&#160;&#160;&#160;&#160;Contraceptive Implant', available: null, reviewed: null, order: 15 },
                        { id: 16, description: '&#160;&#160;&#160;&#160;Copper-bearing IUD', available: null, reviewed: null, order: 16 },
                        { id: 17, description: '&#160;&#160;&#160;&#160;Levonorgestrel IUS', available: null, reviewed: null, order: 17 },
                        { id: 18, description: '&#160;&#160;&#160;&#160;DMPA', available: null, reviewed: null, order: 18 },
                        { id: 19, description: '&#160;&#160;&#160;&#160;Contraceptive Ring & Patch', available: null, reviewed: null, order: 19 },
                        { id: 20, description: '&#160;&#160;&#160;&#160;FemCap or Diaphragm', available: null, reviewed: null, order: 20 },
                        { id: 21, description: '&#160;&#160;&#160;&#160;Female Condom', available: null, reviewed: null, order: 21 },
                    ]
                });
                vm.data = $.extend(vm.data, {
                    nonCoreServices: [
                        { id: 1, description: 'Colposcopy', available: null, reviewed: null, order: 1 },
                        { id: 2, description: 'LEEP', available: null, reviewed: null, order: 2 },
                        { id: 3, description: 'In-Clinic Abortion 2nd gestational limit = XX ', available: null, reviewed: null, order: 3 },
                        { id: 4, description: 'Moderate  Anesthesia Sedation', available: null, reviewed: null, order: 4 },
                        { id: 5, description: 'Abortal Tissue Donation Programs', available: null, reviewed: null, order: 5 },
                        { id: 6, description: 'Female Sterilization – Essure', available: null, reviewed: null, order: 6 },
                        { id: 7, description: 'Female Sterilization – Transabdominal Tubal', available: null, reviewed: null, order: 7 },
                        { id: 8, description: 'Vasectomy', available: null, reviewed: null, order: 8 },
                        { id: 9, description: 'Basic Infertility Services: Male/Female', available: null, reviewed: null, order: 9 },
                        { id: 10, description: 'Prenatal Care - Comprehensive', available: null, reviewed: null, order: 10 },
                        { id: 11, description: 'Urinary Incontinence & Pelvic Floor Disorders', available: null, reviewed: null, order: 11 },
                        { id: 12, description: 'Transgender Services', available: null, reviewed: null, order: 12 },
                        { id: 13, description: 'Expanded Breast Services – Level II', available: null, reviewed: null, order: 13 },
                        { id: 14, description: 'Level II GYN – Expanded Office Gynecology', available: null, reviewed: null, order: 14 },
                        { id: 15, description: 'Men’s Reproductive Services', available: null, reviewed: null, order: 15 },
                        { id: 16, description: 'Advanced Infertility Services (in MS&G)', available: null, reviewed: null, order: 16 },
                        { id: 17, description: 'Early Pregnancy Evaluation & Management', available: null, reviewed: null, order: 17 },
                        { id: 18, description: 'Limited Primary Care', available: null, reviewed: null, order: 18 },
                        { id: 19, description: 'Other Services (List Below):', available: null, reviewed: null, order: 19 },
                    ]
                });
                vm.data = $.extend(vm.data, {
                    ppfaApproval: [
                        { id: 1, description: 'Monitored Anesthesia Care (MAC)', available: null, reviewed: null, order: 1 },
                        { id: 2, description: 'Expanded Gynecologic Surgery (Level III) ', available: null, reviewed: null, order: 2 },
                        { id: 3, description: 'Comprehensive Primary Care', available: null, reviewed: null, order: 3 },
                        { id: 4, description: 'Advanced Infertility Services (not in MS&G)', available: null, reviewed: null, order: 4 },
                        { id: 5, description: 'Counseling services ', available: null, reviewed: null, order: 5 },
                        { id: 6, description: 'Other Services (List Below)', available: null, reviewed: null, order: 6 },
                    ]
                });
                globalService.data.headerNavText = '<a href="#/">Start</a> > <a href="#/' + routes.main + '">Final Affiliate Accreditation Report</a>';
                globalService.dialog.hideWaiting();
            } catch (e) {
                $state.go(routes.app);
            }
        }
    }
})(window.define, window.angular);