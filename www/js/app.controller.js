var app = angular.module('app');

// creation du controleur
app.controller('countriesListCtrl', function ($scope, countriesService) {
    $scope.message = "test";

    countriesService.getList()
        .then(function (response) {
            console.log(response.data);

            $scope.countries = response.data;
        })
        .catch(function (error) {
            console.error(error.message);
        });
});

// creation du controleur
app.controller('countryContractCtrl', function ($scope, $stateParams, countriesService) {
    $scope.message = "test";

    countriesService.getCountry($stateParams.iso2)
        .then(function (response) {
            $scope.country = response.data;
        });
    countriesService.getCountryContract($stateParams.iso2)
        .then(function (response) {
            console.log(response.data);

            $scope.contracts = response.data;
        })
        .catch(function (error) {
            console.error(error.message);
        });
});

// creation du controleur
app.controller('stationsContractCtrl', function ($scope, $stateParams, countriesService, $interval) {
    $scope.message = "test";

    this.displayStations = function () {
        countriesService.getStations($stateParams.id)
            .then(function (response) {
                console.log(response.data);

                $scope.stations = response.data;
            })
            .catch(function (error) {
                console.error(error.message);
            });
    };

    var theInterval = $interval(this.displayStations, 1000);

    $scope.$on('$destroy', function () {
        $interval.cancel(theInterval)
    });

    this.displayStations();
});

app.controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, countriesService, mapService) {
    var options = {timeout: 10000, enableHighAccuracy: true};

    //TIMEOUT for have fun with loader :D
    setTimeout(function(){
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            console.log(position.coords.latitude);
            console.log(position.coords.longitude);

            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            mapService.displayMarker(latLng, $scope, true, null);

            countriesService.getContracts()
                .then(function (response) {

                    contract = mapService.getNearest(response.data, latLng, false, $scope);
                    console.log("Plus proche " + contract.name);

                    countriesService.getStations(contract.id)
                        .then(function (response) {

                            station = mapService.getNearest(response.data, latLng, true, $scope);
                            console.log("Plus proche " + station.name);
                        })
                        .catch(function (error) {
                            console.error(error.message);
                        });
                })
                .catch(function (error) {
                    console.error(error.message);
                });
        }, function (error) {
            console.log("Could not get location");
        });
    }, 2000);
});