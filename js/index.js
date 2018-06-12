var map, infowindow, geocoder, pos, modal, modalSpan, breadcrumb, marker;

//modal to show when location is not on:
modal= document.getElementById('modal');
modalSpan= document.getElementsByClassName('close')[0];
//breadcrumb to display data title from input json files
breadcrumb= document.getElementsByClassName('breadcrumb');

//modalview for analysis view on rightmost section
function modalView() {
  modal.style.display= 'block';
  modalSpan.onclick= function(){
    modal.style.display= 'none';
  };
  window.onclick= function(event) {
    if (event.target== modal) {
      modal.style.display= 'none';
    }
  };
} //end modalView

// side panel transitional function holder
function openNav() {
    document.getElementById("sidePanel").style.width = "550px";
    document.getElementById("sidePanelMain").style.marginRight = "550px";
}

function closeNav() {
    document.getElementById("sidePanel").style.width = "0";
    document.getElementById("sidePanelMain").style.marginRight= "initial";
} //end side panel transitional function holder

// init function for google map and libraries: places
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41, lng: -97},
    zoom: 4,
    disableDefaultUI: true
  });
  map.data.setStyle({
    fillColor: 'blue',
    strokeWeight: 2,
    strokeWeight: '#fff'
  });
  var input = document.getElementById('searchAddressText'); //text into header searchBar
  var input1= document.getElementById('searchAddressText1'); //text into modal view's searchbar
  autocompleteAddress(input);
  autocompleteAddress(input1);

  // HTML5 geolocation
  geocoder = new google.maps.Geocoder;
  infowindow = new google.maps.InfoWindow;
  if (navigator.geoLocation) {
    console.log('done');
  }
  geoLocation(); //end HTML5 geolocation
  map.data.setStyle(styleFeature);
  map.data.addListener('mouseover', mouseInToRegion); //event callback function for mouse in function
  map.data.addListener('mouseout', mouseOutOfRegion); //event callback function for mouse out function
  loadMapShapes();

} //end initMap

function geoLocation() {
  //marker.setVisible(false);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infowindow.setPosition(pos);
      infowindow.open(map);
      map.setCenter(pos);
      geocodeLatLng(geocoder, map, infowindow, pos);
      addMarker(pos);
    }, function() {
      handleLocationError(true, infowindow, map.getCenter());
    });
  } else {    // Browser doesn't support Geolocation
    handleLocationError(false, infowindow, map.getCenter());
  }// end HTML5 geolocation
}

//adding marker to the map
function addMarker(pos){
  marker = new google.maps.Marker({
    position: this.pos,
    map: map,
  });
  map.panTo(pos);
  infowindow.close();
  //map.setZoom(4);
} // end adding marker to the map

//handle location if not enable GPS
function handleLocationError(hasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.open();
  infoWindow.setContent( hasGeolocation ?
                        modalView() :
                        'Error: Your browser doesn\'t support geolocation.');
}  //end handle location if not eanble GPS

//load json files
function loadMapShapes() {
  //map.data.loadGeoJson("https://firebasestorage.googleapis.com/v0/b/lodes-17606.appspot.com/o/counties.json?alt=media&token=f780e10c-1236-4ee0-879f-01a813a2bb0a");
  console.log('done');
  // map.data.loadGeoJson("https://firebasestorage.googleapis.com/v0/b/lodes-17606.appspot.com/o/newTRY.json?alt=media&token=30a13516-4746-4d72-aeb2-38a298ac6581");
  // map.data.loadGeoJson("https://firebasestorage.googleapis.com/v0/b/lodes-17606.appspot.com/o/ohioBlock.json?alt=media&token=c702d586-c541-4a85-828c-d9c19279bb33");
  map.data.loadGeoJson('jsonFiles/counties.json');
}

// autocomplete google.places api
function autocompleteAddress(input) {
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener('place_changed', function() {
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: " + place.name + "'");
      return;
    }
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(10);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
    //console.log(place.address_components);
    //console.log(address);
  });
} //end autocomplete google places api

//reverse geocoding
function geocodeLatLng( geocoder, map, infowindow, pos){
  geocoder.geocode({'location': pos}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: pos,
          map: map
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
        mouseInToRegion(pos);
        // console.log(results[0].formatted_address);
        //console.log(results[0].address_components);
      }
    }
  });
}// end reverse geocoding
function mouseInToRegion(e) {
  e.feature.setProperty('state', 'hover');
  // console.log(e.feature.f);
}// end of mouseInToRegion function
function mouseOutOfRegion(e){
  e.feature.setProperty('state', 'normal');
}//end of mouseOutOfRegion function
function styleFeature(feature){
  var zindex=1, outlineWeight=0.5, fillcolor= 'green';
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
    fillcolor= 'black';
    //map.setZoom(13);
    console.log(feature);
  }
  return {
    fillColor: fillcolor,
    strokeWeight: outlineWeight,
    zIndex: zindex,
    fillOpacity: 0.75,
    strokeColor: '#aee'
  }
}//end of styleFeature function
