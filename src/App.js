import React, { Component } from 'react';
import './App.css';
import LeafletMap from './LeafletMap'

const hostname = window && window.location && window.location.hostname;
let api_base_url = ''
if (hostname.includes('localhost')) {
  api_base_url = new URL('http://localhost:3000/api/ip_locations')
} else {
  api_base_url = new URL('http://ipv6mappingapi-env.bbqigzi5ur.us-east-1.elasticbeanstalk.com/api/ip_locations')
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <LeafletMap apiUrl={api_base_url} />
      </div>
    );
  }
}

export default App;