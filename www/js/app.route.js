var app = angular.module('app');


app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('countriesList', {
            url: '/',
            controller: 'countriesListCtrl',
            templateUrl: 'template/countries/list.html'
        })

        .state('countryContract', {
            url: '/country/:iso2',
            controller: 'countryContractCtrl',
            templateUrl: 'template/countries/countryContract.html'
        })

        .state('stationDetail', {
            url: '/country/:id',
            controller: 'stationsContractCtrl',
            templateUrl: 'template/countries/stations.html'
        })
        .state('map', {
            url: '/station',
            templateUrl: 'template/map.html',
            controller: 'MapCtrl'
        })
});