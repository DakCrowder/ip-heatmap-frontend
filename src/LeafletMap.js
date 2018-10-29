import React, { Component } from 'react';
import { Map, TileLayer, LayersControl, FeatureGroup } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer';

const mapBounds = {north_east: {lat: 90 , lng: 180}, south_west: {lat: -70, lng: -180}}

export default class LeafletMap extends Component {
  constructor() {
    super()
    this.state = {
      height: window.innerHeight,
      points: [],
      fetched: false,
    }
  }

  handleResize = () => this.setState({
    height: window.innerHeight
  });

  componentDidMount() {
    this.fetchPoints()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  mapBoundsToArrays() {
    return [[mapBounds.south_west.lat, mapBounds.south_west.lng], [[mapBounds.north_east.lat, mapBounds.north_east.lng]]]
  }

  fetchPoints() {
    let url = this.props.apiUrl
    let params = {bounds: JSON.stringify(mapBounds)}
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url)
      .then(
        (response) => {
          if (response.status !== 200) {
            alert('Error with api response, status is: ' + response.status);
            return;
          }

          response.json().then((data) => {
            this.setState({
              points: data,
              fetched: true,
            })
          });
        }
      )
      .catch(function(err) {
        alert('Error with fetch: ' + err);
      });
  }

  renderSpinner() {
    return(
      <div className={'loader-container'}>
        <div className={'loader'} />
      </div>
    )
  }

  renderMap() {
    return (
      <Map center={[0, 0]} zoom={2} style={{height: this.state.height + 'px' }} maxBounds={this.mapBoundsToArrays()} >
        <LayersControl>
          <LayersControl.BaseLayer name="Base" checked>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Heatmap" checked>
            <FeatureGroup color="purple">
              <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={this.state.points}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                radius={25}
                minOpacity={0.1}
                maxZoom={10}
                gradient={{
                  0: 'Navy',
                  0.25: 'Blue',
                  0.5: 'Green',
                  0.75: 'Yellow',
                  1: 'Red'
                }}
                intensityExtractor={m => parseFloat(m[2])}
              />
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </Map>
    );
  }

  render() {
    return (
      <div>
        {this.state.fetched ? this.renderMap() : this.renderSpinner()}
      </div>
    );
  }
}