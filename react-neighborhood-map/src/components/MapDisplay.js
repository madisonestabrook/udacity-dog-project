import React,  {Component} from 'react';
import NoMapDisplay from './NoMapDisplay';
import {Map, GoogleApiWrapper, InfoWindow} from 'google-maps-react'

const MAP_KEY = "AIzaSyDy_XnoCcWjWqlX_h1FRUllmbGdKQ3pgpY";
const FS_CLIENT = "WU2BOB3PCV30TM3IGSECCKPD2ATVUBIGAFG2MBR0VN3ASJH3";
const FS_SECRET = "UQJVO2IBMJBPXLNRAM04SVMNUVOSDKQTPCWNYLBD3ZPCOYZR";
const FS_VERSION = "20180323";
const TZ_KEY = "LkByrfAXgBm9FXMYbQMDPeutQaymq3";
const AIR_KEY = "bFbko93KDiZa67QYy"

class MapDisplay extends Component {
  state = {
    map: null,
    markers: [],
    markerProps: [],
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false
  }
  componentDidMount = () => {
  }
  componentWillReceiveProps = (props) => {
    this.setState({firstDrop: false});
    // Changes the number of locations to update the markers
    if(this.state.markers.length !== props.locations.length){
        this.closeInfoWindow();
        this.updateMarkers(props.locations);
        this.setState({activeMarker: null});
        return;
    }
    // Closes the info window if the selected item is not the same as the active marker
    if(!props.selectedIndex || (this.state.activeMarker && (this.state.markers[props.selectedIndex] !== this.state.activeMarker))){
            this.closeInfoWindow();
    }
    // Makes sure that there is a selected index
    if(props.selectedIndex === null || typeof(props.selectedIndex) === "undefined"){
      return;
    }
    // Treats the marker as clicked
    this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex])
  }
  mapReady = (props, map) => {
    // Saves the map reference in state and prepares the location markers
    this.setState({map});
    this.updateMarkers(this.props.locations);
  }
  closeInfoWindow = () => {
    // Disables any active marker animations
    this.state.activeMarker && this
        .state
        .activeMarker
        .setAnimation(null);
        this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProps: null})
  }

  onMarkerClick = (props, marker, e) => {
      // Closes any info window or windows that are already open
      this.closeInfoWindow();
      // Fetches the FourSquare data
      let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
      let headers = new Headers();
      let request = new Request(url, {
          method: 'GET',
          Headers
      });
      // Creates props for the active marker
      let activeMarkerProps;
      fetch(request)
      .then(response => response.json())
      .then(result => {
        // Gets just the business reference from FourSquare and returns
        let restaurant = this.getBusinessInfo(props, result);
        activeMarkerProps = {
              ...props,
              foursquare: restaurant[0]
        };
        /* Gets the list of images for the restaurant if we have the Four data or
        finish setting state with data we have */
        if(activeMarkerProps.foursquare) {
          let url = `https://api.foursquare.com/v2/venues/${restaurant[0].id}/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;
          fetch(url)
          .then(response => response.json())
          .then(result => {
              activeMarkerProps = {
                ...activeMarkerProps,
                images: result.response.photos
              };
                if(this.state.activeMarker)
                  this.state.activeMarker.setAnimation(null);
                marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
        })
      } else {
        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
      }
});
let city = 'Denver';
let url2 = `https://www.amdoren.com/api/timezone.php?api-key=${TZ_KEY}&loc=${city}`;
let request2 = new Request(url2, {
    method: 'GET',
    mode: "no-cors"
   });

   fetch(request3).then(function(response){
     response = response.JSON;
     response = activeMarkerProps = {
       ...activeMarkerProps
     }
   }, console.log("Catch time error"));

let url3 = `https://api.airvisual.com/v2/city?city=${city}&state=Colorado&country=USA&key=${AIR_KEY}`;
let request3 = new Request (url3, {
     method: 'GET',
     mode: "no-cors"
});
fetch(request3).then(function(response) {
 response = response.JSON;
 response = activeMarkerProps = {
    ...activeMarkerProps
  }
}, console.log("Catch air error"));
  }
  getBusinessInfo = (props, data) => {
    /* Looks for matching data in the Foursquare API compared what we already know */
    return data
      .response
      .venues
      .filter(item => item.name.includes(props.name) || props.name.includes(item.name));
  }
  updateMarkers = (locations) => {
    // If all the locations are filtered, we are done!
    if(!locations)
    return;
    /* Iterates over the locations to create parallel references to marker properties
    and markers that can be used for future interactions. Adds markers to the map */
    let markerProps = [];
    let markers = locations.map((location, index) => {
      let mProps = {
        key: index,
        index,
        name: location.name,
        position: location.pos,
        url: location.url
    };
    markerProps.push(mProps);
    let animation = this.props.google.maps.Animation.DROP;
    let marker = new this.props.google.maps.Marker({
        position: location.pos,
        map: this.state.map,
        animation
    });
    marker.addListener( 'click', () => {
        this.onMarkerClick(mProps, marker, null);
    });
    return marker;
    })
    this.setState({markers, markerProps});
  }
  render = () => {
    const style = {
      width: '100%',
      height: '100%'
    }
    const center =  {
      lat:  39.758706,
      lng: -104.999957
     }
     let amProps = this.state.activeMarkerProps;
     return (
       <Map
       role="application"
       aria-label="map"
       onReady={this.mapReady}
       google={this.props.google}
       zoom={this.props.zoom}
       style={style}
       initialCenter={center}
       onClick={this.closeInfoWindow}>
       <InfoWindow
       marker={this.state.activeMarker}
       visible={this.state.showingInfoWindow}
       onClose={this.closeInfoWindow}>
       <div className="infoWindow">
        <h3>{amProps && amProps.name}</h3>
        {amProps && amProps.url
          ? (
            <a href={amProps.url}>See website</a>
          )
          : ""}
        {amProps && amProps.images
        ? (
          <div className="image"> <img
          alt={amProps.name + "picture"}
          src={amProps.images.items[0].prefix + "100x100" + amProps.images.items[0].suffix} />
          <p>Image from <a href="https://foursquare.com/">Foursquare</a></p>
          </div>
        )
        : " "}
      {amProps && amProps.time
      ? (
        <p>The current time at {amProps && amProps.name} is {amProps.time}.</p>
      )
      : "The time is not currently known; "
      }
      {amProps && amProps.air
        ? (
          <p>The air quality is {amProps.air}</p>
        )
        : "the air quality is not currently known"
      }
       </div>
       </InfoWindow>
       </Map>
     )
  }
    }
export default GoogleApiWrapper({apiKey: MAP_KEY, LoadingContainer: NoMapDisplay})(MapDisplay)
