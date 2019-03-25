import flood_0_5 from './images/inundation_0.5.png';
import flood_1_0 from './images/inundation_1.0.png';
import flood_1_5 from './images/inundation_1.5.png';
import flood_2_0 from './images/inundation_2.0.png';
import flood_2_5 from './images/inundation_2.5.png';
import flood_3_0 from './images/inundation_3.0.png';
import flood_3_5 from './images/inundation_3.5.png';
import flood_4_0 from './images/inundation_4.0.png';
import flood_4_5 from './images/inundation_4.5.png';
import flood_5_0 from './images/inundation_5.0.png';
import discharge020 from './images/disch_2m.020.png';
import discharge040 from './images/disch_2m.040.png';
import discharge060 from './images/disch_2m.060.png';
import discharge080 from './images/disch_2m.080.png';
import discharge100 from './images/disch_2m.100.png';
import discharge120 from './images/disch_2m.120.png';
import flooding_gif from './images/flooding1.gif';
import bboxPolygon from '@turf/bbox-polygon';

import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {ScreenGridLayer} from 'deck.gl';
import {isWebGL2} from 'luma.gl';
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';


mapboxgl.accessToken = process.env.MapboxAccessToken;
const map = new mapboxgl.Map({
    container: 'map',
    zoom: 12,
    center: [-78.6319,35.7099],
    pitch: 45,
    style: 'mapbox://styles/ctwhite/cjtnhxudz2j4l1fs74h5hygce',
    hash: true
}).addControl(new mapboxgl.NavigationControl());

map.on('load', () => {

    function setScaleForLevel(scale) {
        let setScale = 15;
        switch (scale) {
            case 'Household':
                setScale = 17;
                break;
            case 'Neighborhood':
                setScale = 15;
                break;
            case 'City':
                setScale = 12;
                break;
            case 'Region':
                setScale = 10;
                break;
            default:
                setScale = 15;
        }
        return setScale;
    }

    function flyToStore(currentFeature) {
        map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: setScaleForLevel(currentFeature.properties.what_spatial_scales_does_this_p)
        });
      }
      
      function createPopUp(currentFeature) {
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        // Check if there is already a popup on the map and if so, remove it
        if (popUps[0]) popUps[0].remove();
      
        var popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML(`<h3>${currentFeature.properties.why_is_this_location_a_problem}</h3>` +
            '<h4><strong>Difficulty: </strong>' + currentFeature.properties.how_challenging_is_this_problem + '</h4>' +
            '<h4><strong>Challenge: </strong>' + currentFeature.properties.why_is_this_location_a_problem + '</h4>' +
            '<h4><strong>Obstacle: </strong>' + currentFeature.properties.what_is_the_greatest_barrier_to + '</h4>' +
            '<h4><strong>Supplies: </strong>' + currentFeature.properties.what_actions_can_be_taken_to_fi + '</h4>' +
            '<h4>Get Started!</h4>'
            )
          .addTo(map);
      }

      // This will let you use the .remove() function later on
        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
            };
        }

    // //Discharge GIF
    // var currentDischargeImage = 0;
    // var dischargeImages = [discharge020, discharge040, discharge060, discharge080, discharge100, discharge120];
    // function getDischargePath() {
    //     return dischargeImages[currentDischargeImage];
    // }
 
    // map.addSource('dischargeOverlay', {
    //     type: 'image',
    //     url: getDischargePath(),
    //     coordinates: [
    //         [-78.7746204947222, 35.8096093825],
    //         [-78.6083031766667, 35.8096093825],
    //         [-78.6083031766667, 35.6875072969444],
    //         [-78.7746204947222, 35.6875072969444]    
    //     ]
    //  });

    // map.addLayer({
    //     "id": "dischargeOverlay",
    //     "source": "dischargeOverlay",
    //     "type": "raster",
    //     "paint": {
    //         "raster-opacity": 0.50,
    //         "raster-fade-duration": 0
    //     }
    // });

    // setInterval(function() {
    //     currentDischargeImage = currentDischargeImage + 1;
    //     if (currentDischargeImage == 5) {
    //         currentDischargeImage = 0;
    //     }
    //     map.getSource("dischargeOverlay").updateImage({ url: getDischargePath() });
    // }, 200);

    //Flooding GIF
    var frameCount = 10;
    var currentImage = 9;
    var floodingImages = [flood_0_5, flood_1_0, flood_1_5, flood_2_0, flood_2_5, flood_3_0, flood_3_5, flood_4_0, flood_4_5, flood_5_0];
    function getPath() {
        return floodingImages[currentImage];
    }


    map.addSource('floodOverlay', {
        type: 'image',
        url: getPath(),
        coordinates: [
            [-78.7746204947222, 35.8096093825],
            [-78.6083031766667, 35.8096093825],
            [-78.6083031766667, 35.6875072969444],
            [-78.7746204947222, 35.6875072969444]    
        ]
     });

    map.addLayer({
        "id": "floodOverlay",
        "source": "floodOverlay",
        "type": "raster",
        "paint": {
            "raster-opacity": 0.85,
            "raster-fade-duration": 0
        }
    });

    // setInterval(function() {
    //     currentImage = currentImage + 1;
    //     if (currentImage == 10) {
    //         currentImage = 0;
    //     }
    //     map.getSource("floodOverlay").updateImage({ url: getPath() });
    // }, 200);

    if (! map.getSource('composite')) {map.addSource('composite', { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v7'});}

    const layers = map.getStyle().layers;
 
    let labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
        }
    }

    function buildLevelList(data) {
        // Iterate through the list of stores
        for (i = 0; i < data.features.length; i++) {
          var currentFeature = data.features[i];
          // Shorten data.feature.properties to `prop` so we're not
          // writing this long form over and over again.
          var prop = currentFeature.properties;
          // Select the listing container in the HTML and append a div
          // with the class 'item' for each store
          var listings = document.getElementById('listings');
          var listing = listings.appendChild(document.createElement('div'));
          listing.className = 'item';
          listing.id = 'listing-' + i;
      
          // Create a new link with the class 'title' for each store
          // and fill it with the store address
          var link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';
          link.dataPosition = i;
          link.innerHTML = prop.why_is_this_location_a_problem;

           // Add an event listener for the links in the sidebar listing
        link.addEventListener('click', function(e) {
            // Update the currentFeature to the store associated with the clicked link
            var clickedListing = data.features[this.dataPosition];
            // 1. Fly to the point associated with the clicked link
            flyToStore(clickedListing);
            // 2. Close all other popups and display popup for clicked store
            createPopUp(clickedListing);
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
            activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
        });
      
          // Create a new div with the class 'details' for each store
          // and fill it with the city and phone number
          var details = listing.appendChild(document.createElement('div'));
          details.innerHTML = prop.how_challenging_is_this_problem;
          if (prop.phone) {
            details.innerHTML += ' · ' + prop.phoneFormatted;
          }
        }
      }
      

      let levels = fetch('https://services1.arcgis.com/aT1T0pU1ZdpuDk1t/ArcGIS/rest/services/survey123_571499fe84ac4125abe48b793b9970a3_stakeholder/FeatureServer/0/query?f=json&returnGeometry=true&inSR=102100&outFields=*&outSR=4326&resultType=tile&where=1=1')
        .then(res=> res.json())
        .then(json=> arcgisToGeoJSON(json))
        .then(levels=> {
            console.log("levels",levels);
            map.addSource('levels', {
                "type": "geojson",
                "data": levels
                });
                map.addLayer({
                    "id": "levels",
                    "source": "levels",
                    "type": "circle",
                    "paint": {
                    "circle-radius": 10,
                    "circle-color": "#FFE100"
                    },
                    // "type": "symbol",
                    // "layout": {
                    //     "icon-image": "star-15",
                    //     // "text-field": "{title}",
                    //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    //     "text-offset": [0, 0.6],
                    //     "text-anchor": "top",
                    //     "icon-color": "#e00000"
                    //     }
                });
                buildLevelList(levels);
                        // Add an event listener for when a user clicks on the map
                map.on('click', function(e) {
                    // Query all the rendered points in the view
                    var features = map.queryRenderedFeatures(e.point, { layers: ['levels'] });
                    if (features.length) {
                    var clickedPoint = features[0];
                    // 1. Fly to the point
                    flyToStore(clickedPoint);
                    // 2. Close all other popups and display popup for clicked store
                    createPopUp(clickedPoint);
                    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
                    var activeItem = document.getElementsByClassName('active');
                    if (activeItem[0]) {
                        activeItem[0].classList.remove('active');
                    }
                    // Find the index of the store.features that corresponds to the clickedPoint that fired the event listener
                    var selectedFeature = clickedPoint.properties.ObjectId;
                
                    for (var i = 0; i < levels.features.length; i++) {
                        if (levels.features[i].properties.ObjectId === selectedFeature) {
                        selectedFeatureIndex = i;
                        }
                    }
                    // Select the correct list item using the found index and add the active class
                    var listing = document.getElementById('listing-' + selectedFeatureIndex);
                    listing.classList.add('active');
                    }
                });
            return levels;
        });

       


  
        
        


       // Add the data to your map as a layer
 
   

     map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 14,
        'paint': {
            'fill-extrusion-color': '#aaa',
            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                14, 0,
                14.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                14, 0,
                14.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': 0.8
            }
        }, labelLayerId);
  

});
