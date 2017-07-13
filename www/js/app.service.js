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
            var tempDist = google.maps.geometry.spherical.computeDistanceBetween(latLng, latLngObject);
            if (currentDistanceProche == 0) {
                object = value;
                currentDistanceProche = tempDist;
            } else {
                if (currentDistanceProche > tempDist) {
                    object = value;
                    currentDistanceProche = tempDist;
                }
            }
            if (display) this.displayMarker(latLngObject, $scope, false, value);
        }.bind(this), log);
        return object;
    };

    this.displayMarker = function(latLng, $scope, currentPos, value) {

        var marker;
        var prevMarker = 0;
        var prevWindow = 0;
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

            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

                var infowindow = new google.maps.InfoWindow({
                    content: '<b>' + value.name + '</b></br>' +  value.address + ',</br>' + value.availableBikes +  ' vélo(s) disponible(s),</br> '  + value.availableFreeSpots + ' place(s) libre(s)'
                });

                google.maps.event.addListener(marker, 'click', function() {
                    if(!marker.open){
                        if(prevMarker != 0 && prevWindow != 0) {
                            prevWindow.close();
                            prevMarker.open = false;
                        }
                        prevMarker = marker;
                        prevWindow = infowindow;
                        infowindow.open(map,marker);
                        marker.open = true;
                    }
                    else{
                        infowindow.close();
                        marker.open = false;
                    }
                });
            });
        }
    };
});