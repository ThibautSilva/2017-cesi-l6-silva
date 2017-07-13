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
app.service("streeviewService", function ($http){
    /**
     * @return promise
     */
    this.getPicture = function (latitude, longitude) {
        return $http.get("https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + latitude + "," + longitude +"10.013988&heading=151.78&pitch=-0.76");
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
        if (currentPos) {
            var icon = {
                url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Simpleicons_Places_map-marker-with-a-person-shape.svg",
                anchor: new google.maps.Point(25,50),
                scaledSize: new google.maps.Size(40,40)
            };
            marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.BOUNCE,
                position: latLng,
                icon: icon
            });
        } else {
            marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            google.maps.event.addListenerOnce($scope.map, 'idle', function(){

                var infowindow = new google.maps.InfoWindow({
                    content: '<b>' + value.name + '</b></br>' +  value.address + ',</br>' + value.availableBikes +  ' vélo(s) disponible(s),</br> '  + value.availableFreeSpots + ' place(s) libre(s)'
                });

                google.maps.event.addListener(marker, 'click', function() {
                    if(!marker.open) {
                        if($scope.prevWindow != 0) {
                            $scope.prevWindow.close();
                            $scope.prevMarker.open = false;
                        }
                        $scope.prevMarker = marker;
                        $scope.prevWindow = infowindow;
                        infowindow.open(map,marker);
                        marker.open = true;
                    } else {
                        infowindow.close();
                        marker.open = false;
                    }
                });
            });
        }
    };
});