/**
 * Benchmarks data service.
 */
app.service('benchmarksService', function ($http) {
    let service = this;
    
    service.getData = function(params, success, error) {
        $http({
            method: 'POST',
            url: '/block/bench/data/get',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param(params)
        }).then(success, error);
    };
    /*
    service.getNetworks = function(success, error) {
        $http({
            method: 'POST',
            url: '/block/networks/get',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(success, error);
    };
    
    service.getTimeframes = function(success, error) {
        $http({
            method: 'POST',
            url: '/block/bench/timeframes/get',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(success, error);
    };
    */
    
});