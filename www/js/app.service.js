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

app.service("mapService", function ($http, apiHost){

    this.getNearest = function(data, latLng, display, $scope) {
        var log = [];
        currentDistanceProche = 0;
        var object;
        angular.forEach(data, function (value, key) {
            var latLngObject = new google.maps.LatLng(value.latitude, value.longitude);
            if (currentDistanceProche == 0) {
                object = value;
                currentDistanceProche = google.maps.geometry.spherical.computeDistanceBetween(latLng, latLngObject);
            } else {
                if (currentDistanceProche > google.maps.geometry.spherical.computeDistanceBetween(latLng, latLngObject)) {
                    object = value;
                    currentDistanceProche = google.maps.geometry.spherical.computeDistanceBetween(latLng, latLngObject);
                }
            }
            if (display) this.displayMarker(latLngObject, $scope, false);
        }.bind(this), log);
        return object;
    };

    this.displayMarker = function(latLng, $scope, currentPos) {

        var marker;
        if (currentPos) {
            marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.BOUNCE,
                position: latLng
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
    };
});