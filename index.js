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


mapboxgl.accessToken = process.env.MapboxAccessToken;
const map = new mapboxgl.Map({
    container: 'map',
    zoom: 12,
    center: [-78.6319,35.7099],
    pitch: 45,
    style: 'mapbox://styles/mapbox/satellite-v9'
}).addControl(new mapboxgl.NavigationControl());

map.on('load', () => {

    //Discharge GIF
    var currentDischargeImage = 0;
    var dischargeImages = [discharge020, discharge040, discharge060, discharge080, discharge100, discharge120];
    function getDischargePath() {
        return dischargeImages[currentDischargeImage];
    }
    
    map.addSource('dischargeOverlay', {
        type: 'image',
        url: getDischargePath(),
        coordinates: [
            [-78.7746204947222, 35.8096093825],
            [-78.6083031766667, 35.8096093825],
            [-78.6083031766667, 35.6875072969444],
            [-78.7746204947222, 35.6875072969444]    
        ]
     });

    map.addLayer({
        "id": "dischargeOverlay",
        "source": "dischargeOverlay",
        "type": "raster",
        "paint": {
            "raster-opacity": 0.50,
            "raster-fade-duration": 0
        }
    });

    setInterval(function() {
        currentDischargeImage = currentDischargeImage + 1;
        if (currentDischargeImage == 5) {
            currentDischargeImage = 0;
        }
        map.getSource("dischargeOverlay").updateImage({ url: getDischargePath() });
    }, 200);

    //Flooding GIF
    var frameCount = 10;
    var currentImage = 0;
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

    setInterval(function() {
        currentImage = currentImage + 1;
        if (currentImage == 10) {
            currentImage = 0;
        }
        map.getSource("floodOverlay").updateImage({ url: getPath() });
    }, 200);

    if (! map.getSource('composite')) {map.addSource('composite', { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v7'});}

    const layers = map.getStyle().layers;
 
    let labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
        }
    }

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


        map.addLayer({
            'id': 'region',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            [-78.7746204947222, 35.8096093825],
                            [-78.6083031766667, 35.8096093825],
                            [-78.6083031766667, 35.6875072969444],
                            [-78.7746204947222, 35.6875072969444]  
                        ]
                    }
                }
            },
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        });

});


// import React, {Component} from 'react';
// import {render} from 'react-dom';
// import {StaticMap} from 'react-map-gl';
// import DeckGL, {ScreenGridLayer} from 'deck.gl';
// import {isWebGL2} from 'luma.gl';
// import data from './images/inundation_grid.json';

// // Set your mapbox token here
// const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
// let DATA_URL = data;
// // Source data CSV



// export const INITIAL_VIEW_STATE = {
//   longitude: -73.75,
//   latitude: 40.73,
//   zoom: 9.6,
//   maxZoom: 16,
//   pitch: 0,
//   bearing: 0
// };

// const colorRange = [
//   [255, 255, 178, 25],
//   [254, 217, 118, 85],
//   [254, 178, 76, 127],
//   [253, 141, 60, 170],
//   [240, 59, 32, 212],
//   [189, 0, 38, 255]
// ];

// export class App extends Component {
//   _renderLayers() {
//     const {data = DATA_URL, cellSize = 20, gpuAggregation = true, aggregation = 'Sum'} = this.props;

//     return [
//       new ScreenGridLayer({
//         id: 'grid',
//         data,
//         getPosition: d => d.coordinates,
//         getWeight: d => d.z,
//         cellSizePixels: cellSize,
//         colorRange,
//         gpuAggregation,
//         aggregation
//       })
//     ];
//   }

//   _onInitialized(gl) {
//     if (!isWebGL2(gl)) {
//       console.warn('GPU aggregation is not supported'); // eslint-disable-line
//       if (this.props.disableGPUAggregation) {
//         this.props.disableGPUAggregation();
//       }
//     }
//   }

//   render() {
//     const {viewState, controller = true, baseMap = true} = this.props;

//     return (
//       <DeckGL
//         layers={this._renderLayers()}
//         initialViewState={INITIAL_VIEW_STATE}
//         onWebGLInitialized={this._onInitialized.bind(this)}
//         viewState={viewState}
//         controller={controller}
//       >
//         {baseMap && (
//           <StaticMap
//             reuseMaps
//             mapStyle="mapbox://styles/mapbox/dark-v9"
//             preventStyleDiffing={true}
//             mapboxApiAccessToken={MAPBOX_TOKEN}
//           />
//         )}
//       </DeckGL>
//     );
//   }
// }

// render(<App />,   document.getElementById('app'));

// export function renderToDOM(container) {
//   render(<App />, container);
// }
