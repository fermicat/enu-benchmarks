/**
 * Angular benchmark chart app.
 */
var app = angular.module('benchmarks', []);

app.config(function($interpolateProvider, $locationProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
    $locationProvider.html5Mode({enabled: true, requireBase: false, rewriteLinks: false});
});

app.controller('benchmarksChart', ['$scope', '$location', 'benchmarksService', function($scope, $location, benchmarksService) {
    
    /**
     * Init, called by ng-init
     */
    $scope.init = function() {
        // Setup defaults
        $scope.networkId = 1; 
        $scope.timeframeId = 2;
        $scope.chartState = {
            cpu: { seriesSelect: true },
            ram: { seriesSelect: true }
        };
        $scope.networks = [];
        $scope.timeframes = [];
        $scope.urlParams = {};

        // Get networks
        benchmarksService.getNetworks(function(response) {
            $scope.networks = response.data.networks;
            $scope.processUrlParams();
        });
        
        // Get time frames
        benchmarksService.getTimeframes(function(response) {
            $scope.timeframes = response.data.timeframes;
            $scope.processUrlParams();
        });
        
        // Watch for url changes
        $scope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
            if (oldUrl === newUrl) {
                return;
            }
            $scope.processUrlParams();
        });
    };
    

    $scope.setUrlParams = function() {
        $scope.urlParams.networkId = $scope.networkId;
        $scope.urlParams.timeframeId = $scope.timeframeId;
        let paramStr = '';
        for (let key in $scope.urlParams) {
            if (paramStr.length > 0) {
                paramStr += '&';
            }
            paramStr += key + '=' + $scope.urlParams[key];
        }
        $location.hash(paramStr);
    };
    

    $scope.processUrlParams = function() {
        // Don't bother yet if data isn't fully loaded
        if ($scope.networks.length === 0 || $scope.timeframes.length === 0) {
            return;
        }
        
        // Parse url hash input
        // https://stackoverflow.com/questions/5646851/split-and-parse-window-location-hash
        const hash = $location.hash();
        if (hash !== '') {
            $scope.urlParams = $location.hash().split('&').map(el => el.split('=')).reduce((pre, cur) => { pre[cur[0]] = cur[1]; return pre; }, {});
            
            // Handle disclaimer
            if ('disclaimer' in $scope.urlParams) {
                delete $scope.urlParams.disclaimer;
            }
            if (Object.keys($scope.urlParams).length === 0 && $scope.chartCpu !== undefined) {
                return true;
            }
            
            // Validate network id in url params
            if ($scope.networks.length > 0 && $scope.urlParams.networkId !== undefined) {
                const networkId = parseInt($scope.urlParams.networkId);
                for (let i in $scope.networks) {
                    if ($scope.networks[i].id === networkId && $scope.networkId !== networkId) {
                        $scope.networkId = networkId;
                        changed = true;
                    }
                }
            }
            
            // Validate time frame id in url params
            if ($scope.timeframes.length > 0 && $scope.urlParams.timeframeId !== undefined) {
                const timeframeId = parseInt($scope.urlParams.timeframeId);
                for (let i in $scope.timeframes) {
                    if ($scope.timeframes[i].id === timeframeId && $scope.timeframeId !== timeframeId) {
                        $scope.timeframeId = timeframeId;
                        changed = true;
                    }
                }
            }
        }

        $scope.updateCharts();
    };

    /**
     * Toggle visibility of all lines in a series.
     * 
     * @param chartName
     */
    $scope.toggleSeriesSelect = function(chartName) {
        let chart = $scope.chartCpu;
        if (chartName === 'ram') {
            chart = $scope.chartRam;
        } 
        let state = $scope.chartState[chartName];
        let newState = false;
        if (state === false) {
            newState = true;
        } 
        for (let i in chart.series) {
            if (newState === true) {
                chart.series[i].setVisible(true, false);
                //chart.series[i].show();
            } else {
                chart.series[i].setVisible(false, false);
                //chart.series[i].hide();
            }
        }
        chart.redraw();
        $scope.chartState[chartName] = newState;
    };
    
    /**
     * Get data and init or redraw charts.
     */
    $scope.updateCharts = function() {
        let params = {
            networkId: $scope.networkId,
            timeframeId: $scope.timeframeId,
        };
        
        benchmarksService.getData(params, function(response) {
            // CPU line
            $scope.chartCpu = Highcharts.chart('chart-cpu', {
                chart: { type: 'spline', zoomType: 'x', },
                title: { text: '' },
                yAxis: { title: { text: '<span style="font-size: 0.9rem">Exec. time (ms)</span>' } },
                xAxis: { type: 'datetime', title: 'Time' },
                plotOptions: { spline: { marker: {enabled: true} } },
                credits: { enabled: false },
                series: response.data.cpu,
                time: { useUTC: true },
                legend: { itemStyle: {fontSize: "14px"} },
            });

            // CPU box plot
            /*
            let cats = [];
            for (let i in response.data.cpuBox) {
                cats.push(response.data.cpuBox[i][0]);
            }
            $scope.chartCpu2 = Highcharts.chart('chart-cpu-box', {
                chart: { type: 'boxplot' },
                title: { text: '' },
                yAxis: { title: { text: '<span style="font-size: 0.9rem">Exec. time (ms)</span>' } },
                xAxis: { categories: cats, labels: { style: { fontSize: '13px', color: '#000000' } } },
                //xAxis: { type: 'datetime', title: 'Time' },
                //plotOptions: { spline: { marker: {enabled: true} } },
                credits: { enabled: false },
                series: [{
                    name: 'exec time (ms)',
                    data: response.data.cpuBox,
                    showInLegend: false,
                    colorByPoint: true,
                    lineWidth: 2, 
                }],
                time: { useUTC: true },
            });     
            */

            // RAM
            /* $scope.chartRam = Highcharts.chart('chart-ram', {
                chart: { type: 'spline', zoomType: 'x', },
                title: { text: '' },
                yAxis: { title: { text: 'Milliseconds' } },
                xAxis: { type: 'datetime', title: 'Time' },
                plotOptions: { spline: { marker: {enabled: true} } },
                credits: { enabled: false },
                series: response.data.ram,
                time: { useUTC: true },
                legend: { itemStyle: {fontSize: "14px"} },
            }); */
        }, function (response) {
            console.log('error');
            console.log(response);
        });
    };

}]);
 
