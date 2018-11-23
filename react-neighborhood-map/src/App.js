import React, {Component} from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';

class App extends Component {
  state = {
      lat: 39.758706,
      lon: -104.999957,
      zoom: 12,
      all: locations,
      filtered: null,
      open: false
  }
  styles = {
    menuButton: {
        marginLeft: 10,
        marginRight: 20,
        position: "absolute",
        left: 10,
        top: 20,
        background: "black",
        padding: 10
    },
    hide : {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  };
componentDidMount = () => {
  this.setState({
      ...this.state,
      filtered: this.filterLocations(this.state.all, "")
  });
}
toggleDrawer = () => {
  // Toggles the value of the drawer
  this.setState({
    open: !this.setState.open
  });
}
updateQuery = (query) => {
  // Updates the query and filters the list of locations
  this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterLocations(this.state.all, query)
  });
}
filterLocations = (locations, query) => {
  // Filters locations to match the query string
  return locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
}
clickListItem = (index) => {
  // Sets the state to reflect the selected location array index
  this.setState({selectedIndex: index, open: !this.state.open})
}
  render = () => {
      return(
        <div className="App">
        <div className="Heading and Button">
        <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
          <i className = "fa fa-bars"></i>
        </button>
        <h1>Denver, CO Restaurants</h1>
        </div>
        <MapDisplay
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.filtered}
          clickListItem={this.clickListItem}/>
        <ListDrawer
          locations={this.state.filtered}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          filterLocations={this.updateQuery}
          clickListItem={this.clickListItem}/>
        </div>
      );
  }
}
export default App;
