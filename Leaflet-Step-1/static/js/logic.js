// query for results of the USGS url
var usgsURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform a GET request to the query URL and run createFeatures function
d3.json(usgsURL, function(data) {
  createFeatures(data.features)
});
//markers colors 
function markerColor(mag){
  switch(true){
      case (mag<1):
        return "Olive";
      case (mag<2):
        return "BurlyWood";
      case (mag<3):
        return "GoldenRod";
      case (mag<4):
        return "DarkSalmon";
      case (mag<5):
        return "OrangeRed";
      case (mag<5.5):
        return "Red";
      default:
        return "LightCoral";
  };
}

//function to create circle markers
function createCircleMarker(feature,latlng){
  let options = {
      radius:feature.properties.mag*4,
      fillColor: markerColor(feature.properties.mag),
      color: markerColor(feature.properties.mag),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5
  }
  return L.circleMarker( latlng, options );
}
//create the pop up and on each feature
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")},
    pointToLayer: createCircleMarker
  });
//////
  var legend= L.control({position: 'bottomright'});
    legend.onAdd = function(){ 
    var div= L.DomUtil.create('div', 'legend'); 
    // var limits = geojson.options.limits;
    // var colors = geojson.options.colors;
    // var labels = [];

    //return divLegend;
    var legendInfo = [{
      limit: "Magitnude 0-1",
      color: "Olive"
    },{
      limit: "Magitnude 1-2",
      color: "BurlyWood"
    },{
      limit:"Magitnude 2-3",
      color:"GoldenRod"
    },{
      limit:"Magitnude 3-4",
      color:"DarkSalmon"
    },{
      limit:"Magitnude 4-5",
      color:"OrangeRed"
    },{
      limit:"Magitnude 5+",
      color:"Red"
    }];
    for (i = 0; i < legendInfo.length; i++){
        const html= `<h3>Legend</h3><hr></hr><p>${legendInfo[i].color}+"\">"+${legendInfo[i].limit}+"</p>`
        return html
      };
    div.innerHTML = legendInfo;
    return div;
  legend.addTo(map);
  console.log(legendInfo);
  }
 
///////
  //});

  createMap(earthquakes);
}

////// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude. /////
//function to create map
function createMap(earthquakes) {

  // Tile Layers for the background of the map
  const darkMap = L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.jpg90?access_token={accessToken}',{
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    id: 'mapbox.dark', 
    accessToken: API_KEY, 
    maxZoom: 18
  });

  const lightMap = L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.jpg90?access_token={accessToken}',{
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    id: 'mapbox.light', 
    accessToken: API_KEY, 
    maxZoom: 18
  });

  // Create a baseMaps object to layers
const baseMaps= {
    'Dark Map': darkMap,
    'Light Map': lightMap
};

// Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes //should be markers
    };
    
  // Create the map object with options
  var map = L.map('map', {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [lightMap, earthquakes]
  });

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(map);
}

//function to add legend
var legend= L.control({position: 'bottomright'});
legend.onAdd = function(map){ 
  var div= L.DomUtil.create('div', 'legend');
  // var limits = geojson.options.limits;
  // var colors = geojson.options.colors;
  // var labels = [];

  //return divLegend;
  var legendInfo = [{
    limit: "Magitnude 0-1",
    color: "Olive"
  },{
    limit: "Magitnude 1-2",
    color: "BurlyWood"
  },{
    limit:"Magitnude 2-3",
    color:"GoldenRod"
  },{
    limit:"Magitnude 3-4",
    color:"DarkSalmon"
  },{
    limit:"Magitnude 4-5",
    color:"OrangeRed"
  },{
    limit:"Magitnude 5+",
    color:"Red"
  }];
  for (i = 0; i < legendInfo.length; i++){
      const html= `<h3>Legend</h3><hr></hr><p>${legendInfo[i].color}+"\">"+${legendInfo[i].limit}+"</p>`
      return html
    };
  div.innerHTML = legendInfo;
legend.addTo(map);
}
//   limits.forEach(function(limit, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   });

//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// };

