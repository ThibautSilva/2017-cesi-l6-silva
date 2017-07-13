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

app.controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, countriesService) {
    var options = {timeout: 10000, enableHighAccuracy: true};

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

        displayMarker($scope.latitude, $scope.longitude, $scope, true);

        countriesService.getContracts()
            .then(function (response) {

                console.log(response.data);
                contract = getNearest(response.data, $scope.latitude, $scope.longitude, false, $scope);
                console.log("Plus proche " + contract.name);

                countriesService.getStations(contract.id)
                    .then(function (response) {
                        console.log(response.data);
                        station = getNearest(response.data, $scope.latitude, $scope.longitude, true, $scope);
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
});

function getNearest(data, latitude, longitude, display, $scope) {
    var log = [];
    currentDistanceProche = 0;
    var object;
    angular.forEach(data, function (value, key) {
        if (currentDistanceProche == 0) {
            object = value;
            currentDistanceProche = calcCrow(object.latitude, object.longitude, latitude, longitude);
        } else {
            if (currentDistanceProche > calcCrow(value.latitude, value.longitude, latitude, longitude)) {
                object = value;
                currentDistanceProche = calcCrow(value.latitude, value.longitude, latitude, longitude);
            }
        }
        if (display) displayMarker(value.latitude, value.longitude, $scope, false);
    }, log);
    return object;
}

function displayMarker(latitude, longitude, $scope, currentPos) {

    var latLng = new google.maps.LatLng(latitude, longitude);
    var marker;
    if (currentPos) {
       // var icon = 'http://french-therapy.com/media/catalog/product/cache/2/image/350x350/9df78eab33525d08d6e5fb8d27136e95/s/t/stidec001-0001.png';
        var icon = {
            url: 'http://french-therapy.com/media/catalog/product/cache/2/image/350x350/9df78eab33525d08d6e5fb8d27136e95/s/t/stidec001-0001.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 32)
        };
        marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: icon
        });
    } else {
        marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
    }

    var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
    });
}
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
