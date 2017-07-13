var app = angular.module('app');

app.service("countriesService", function ($http, apiHost){
    /**
     * @return promise
     */
    this.getList = function () {
        return $http.get(apiHost + 'countries');
    };

    /**
     * @return promise
     */
    this.getCountryContract = function ($iso2) {
        return $http.get(apiHost + 'countries/' + $iso2 + '/contracts' );
    };

    /**
     * @return promise
     */
    this.getCountry = function ($iso2) {
        return $http.get(apiHost + 'countries/' + $iso2 );
    };

    /**
     * @return promise
     */
    this.getStations = function ($id) {
        return $http.get(apiHost + 'contracts/' + $id + '/stations');
    };

    /**
     * @return promise
     */
    this.getContracts = function () {
        return $http.get(apiHost + 'contracts');
    };
});