(function (define, angular) {
    var setting = T5;
    window.angular.module(setting.name)
        .directive(setting.directives.dtPicker, dtPickerDr);
        //.directive(setting.directives.orgchart, orgchartDr);
    dtPickerDr.$inject = ['$timeout', 'logger'];
    //orgchartDr.$inject = ['$compile', '$timeout', 'logger'];

    function dtPickerDr($timeout, logger) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var option = {
                    collapse: false,
                    pickTime: false,
                    useCurrent: false,
                    language: 'en',
                    icons: {
                        date: "glyphicon glyphicon-th-large"
                    }
                }               
                $timeout(function () {
                    jQuery(element).datetimepicker(option).on("dp.change", function (event) {
                        var valuePicker = $(this).data().date;
                        var valueInput = $(this).children().first().val();
                        var value = valueInput;
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(value);
                        });
                    });
                });
            }
        };
    }
    function orgchartDr($compile, $timeout, logger) {
        /*https://developers.google.com/chart/interactive/docs/events*/
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                callbackFn: '&',
                ngModel: '='
            },
            link: function (scope, element, attrs, ngModelCtr) {
                element.removeAttr(setting.directives.orgchart);
                /*http://jsfiddle.net/markokristian/9pzpK/*/
                var expressionHandler = scope.callbackFn();
                //google.setOnLoadCallback(drawChart);
                function drawChart(ngModel) {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Node');
                    data.addColumn('string', 'Parent');
                    data.addRows(ngModel);
                    var chart = new google.visualization.OrgChart(element[0]);
                    google.visualization.events.addListener(chart, 'select', selectHandler);
                    chart.draw(data);
                    function selectHandler() {
                        var selection = chart.getSelection();
                        var message = '';
                        for (var i = 0; i < selection.length; i++) {
                            var item = selection[i];
                            if (item.row != null && item.column != null) {
                                var str = data.getFormattedValue(item.row, item.column);
                                message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
                            } else if (item.row != null) {
                                var str = data.getFormattedValue(item.row, 0);
                                message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
                            } else if (item.column != null) {
                                var str = data.getFormattedValue(0, item.column);
                                message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
                            }
                        }
                        if (message == '') {
                            message = 'nothing';
                        }
                        expressionHandler({ arg: message });
                    }
                }
                drawChart(scope.ngModel);
                
            }
        };
    }
})(window.define, window.angular);