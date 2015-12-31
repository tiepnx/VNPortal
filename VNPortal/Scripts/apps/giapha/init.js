'use strict'
T5 = angular.extend(T5, {
    name: 'giapha',
    eleStartApp: "#giapha",
    dependencies: ['ui.router'],
    messages: {

    },
    routes: T5.namespace + ".routes",
    constants: {
        toastr: 'toastr',
        api: 'api'
    },
    directives: {
        dtPicker: T5.namespace + '.dtPicker',
    },
    services: {
        httpService: T5.namespace + ".httpService",
    },
    factorys:{
        global: T5.namespace + '.global',
        start: T5.namespace + '.start',
    },
    controllers: {
        header: T5.namespace + '.header',
        start: T5.namespace + '.start',
        main: T5.namespace + '.main'
    },
    partials: {
        baseUrl: 'scripts/apps/giapha/partials/',
        header: function () { return this.baseUrl + "header.html?" + T5.ver },
        dashboard: function () { return this.baseUrl + "dashboard.html?" + T5.ver },
    }
});