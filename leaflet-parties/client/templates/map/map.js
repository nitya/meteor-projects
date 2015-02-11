// 7. Let's start working with the Map now..
// 


$(window).resize(function () {
  var h = $(window).height(), offsetTop = 90; // Calculate the top offset
  $mc = $('#map_canvas');
  $mc.css('height', (h - offsetTop));
}).resize();

var map, markers = [ ];

var initialize = function(element, centroid, zoom, features) { 
  map = L.map(element, {
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false
  }).setView(new L.LatLng(centroid[0], centroid[1]), zoom);
  
  L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {opacity: .5}).addTo(map);

  map.attributionControl.setPrefix('');
  
	var attribution = new L.Control.Attribution();
  attribution.addAttribution("Geocoding data &copy; 2013 <a href='http://open.mapquestapi.com'>MapQuest, Inc.</a>");
  attribution.addAttribution("Map tiles by <a href='http://stamen.com'>Stamen Design</a> under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>.");
  attribution.addAttribution("Data by <a href='http://openstreetmap.org'>OpenStreetMap</a> under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.");
  
  map.addControl(attribution);
}

var addMarker = function(marker) {
  map.addLayer(marker);
  markers[marker.options._id] = marker;
}

var removeMarker = function(_id) {
  var marker = markers[_id];
  if (map.hasLayer(marker)) map.removeLayer(marker);
}

var createIcon = function(party) {
  var className = 'leaflet-div-icon ';
  className += party.public ? 'public' : 'private';
  return L.divIcon({
    iconSize: [30, 30],
    html: '<b>' + attending(party) + '</b>',
    className: className  
  });
}

var openCreateDialog = function (latlng) {
  Session.set("createCoords", latlng);
  Session.set("createError", null);
  Session.set("showCreateDialog", true);

  console.log("[c/map.js] Set session vars: ",Session.keys);
};


// 7. Initialize Template by registering an observer on the Parties
//    collection. This automatically updates the map when there are
//    changes to Parties documents, by adding/removing map markers
Template.map.created = function() {

  // Note how we are manually responding to observed changes on collection
  // instead of having Map be reactively bound to data.
  Parties.find({}).observe({

    added: function(party) {
      var marker = new L.Marker(party.latlng, {
        _id: party._id,
        icon: createIcon(party)
      })
      .on('click', function(e) {
        Session.set("selected", e.target.options._id);
      });      
      addMarker(marker);
    },

    changed: function(party) {
      var marker = markers[party._id];
      if (marker) 
        marker.setIcon(createIcon(party));
    },

    removed: function(party) {
      removeMarker(party._id);
    }

  });
}


Template.map.rendered = function () { 

  // basic housekeeping
  $(window).resize(function () {
    var h = $(window).height(), offsetTop = 90; // Calculate the top offset
    $('#map_canvas').css('height', (h - offsetTop));
  }).resize();
  
  // initialize map events 
  if (!map) {

    // set default center (I picked Manhattan Lat/Long)
    // e.g., using http://www.distancesfrom.com/Latitude-Longitude.aspx
    // TODO: Move this to a reactively-set variable
    initialize($("#map_canvas")[0], [ 40.7841484, -73.96614069999998 ], 13);
    
    // must be logged in to create parties
    map.on("dblclick", function(e) {
      console.log("[c/map.js] Got double click at: "+e.latlng);
      if (! Meteor.userId()) 
        return;
      openCreateDialog(e.latlng);
    });
    
    
    var self = this;
    Tracker.autorun(function() {
      var selectedParty = Parties.findOne(Session.get("selected"));
      if (selectedParty) {

        if (!self.animatedMarker) {
          var line = L.polyline([[selectedParty.latlng.lat, selectedParty.latlng.lng]]);
          self.animatedMarker = L.animatedMarker(line.getLatLngs(), {
            autoStart: false,
            distance: 3000,  // meters
            interval: 200, // milliseconds
            icon: L.divIcon({
              iconSize: [50, 50],
              className: 'leaflet-animated-icon'
            })
          });
          map.addLayer(self.animatedMarker);
        } 

        // animate to here
        else {       
          var line = L.polyline([
            [self.animatedMarker.getLatLng().lat, self.animatedMarker.getLatLng().lng],
            [selectedParty.latlng.lat, selectedParty.latlng.lng]
          ]);
          self.animatedMarker.setLine(line.getLatLngs());
          self.animatedMarker.start();
        } 
      }
    })
  }
};



