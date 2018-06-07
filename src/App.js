import React, { Component } from 'react';
import logo from './flappy-bird-logo.png';
import './App.css';
import Flappy from './flappybird/flappybird'
import Lesson from './canvas_websocket_lesson'

class App extends Component {
  render() {
    const data = window.location.hash.replace('#', '') || '1';
    return (
      <div className="App">
        {
          (data => data === '1' ? <Lesson /> : <Flappy />)(data)
        }
        {/*<Flappy/>*/}
      </div>
    );
  }
}

export default App;
