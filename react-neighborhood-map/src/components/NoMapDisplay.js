import React, {Component} from 'react';
class NoMapDisplay extends Component {
    state = {
        show: false,
        timeout: null
    }
    componentDidMount = () => {
      let timeout = window.setTimeout(this.showMessage, 1000);
      this.setState({timeout});
    }
    componentWillUnmount = () => {
      window.clearTimeout(this.state.timeout);
    }
    showMessage = () => {
      this.setState({show: true});
    }
    render = () => {
      return (
          <div className="timeout">
              (this.state.show
              ? {
                <div className="error">
                    <h1>Error Loading Page</h1>
                    <p>Could not load map due to a network error. Please try again.</p>
                </div>
              }
              )
              : {<div className="loading"><h1>Loading</h1></div>}
          </div>
      );
    }
}
export default NoMapDisplay
